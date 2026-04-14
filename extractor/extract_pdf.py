import sys
import os
import re
import json
import mysql.connector
from dotenv import load_dotenv
import sys
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Connexion BDD
conn = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = conn.cursor()

def extract_text_from_pdf(pdf_path):
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"Erreur lecture PDF: {e}", file=sys.stderr)
        return ""

def parse_offer(text):
    data = {
        "titre_poste": None,
        "entreprise": None,
        "localisation": {"ville": None, "departement": None},
        "type_contrat": "Alternance",
        "secteur_activite": None,
        "niveau_etudes": None,
        "competences_cles": [],
        "contact_email": None,
        "salaire": None,
        "lien_offre": None
    }

    lines = [l.strip() for l in text.split('\n') if l.strip()]

    # Titre du poste — première ligne non vide souvent
    for line in lines[:5]:
        if len(line) > 10:
            data["titre_poste"] = line
            break

    # Entreprise
    for line in lines:
        if any(kw in line.lower() for kw in ['entreprise', 'société', 'company', 'groupe']):
            parts = line.split(':')
            if len(parts) > 1:
                data["entreprise"] = parts[1].strip()
            break

    # Email
    email_match = re.search(r'[\w.-]+@[\w.-]+\.\w+', text)
    if email_match:
        data["contact_email"] = email_match.group()

    # Localisation
    city_match = re.search(r'\b(Paris|Lyon|Bordeaux|Marseille|Toulouse|Nantes|Lille|Strasbourg|Rennes|Nice)\b', text, re.IGNORECASE)
    if city_match:
        data["localisation"]["ville"] = city_match.group()

    dept_match = re.search(r'\b(75|69|33|13|31|44|59|67|35|06)\b', text)
    if dept_match:
        data["localisation"]["departement"] = dept_match.group()

    # Niveau études
    niveau_match = re.search(r'(BAC\+\d|Bac\+\d|Master|Bachelor|Licence|BTS|BUT)', text, re.IGNORECASE)
    if niveau_match:
        data["niveau_etudes"] = niveau_match.group()

    # Type contrat
    if re.search(r'alternance|apprentissage', text, re.IGNORECASE):
        data["type_contrat"] = "Alternance"
    elif re.search(r'stage', text, re.IGNORECASE):
        data["type_contrat"] = "Stage"
    elif re.search(r'CDI', text):
        data["type_contrat"] = "CDI"
    elif re.search(r'CDD', text):
        data["type_contrat"] = "CDD"

    # Compétences — lignes avec mots clés tech/soft skills
    skill_keywords = [
        'python', 'java', 'react', 'node', 'sql', 'excel', 'powerpoint',
        'photoshop', 'canva', 'figma', 'javascript', 'html', 'css',
        'communication', 'autonomie', 'rigueur', 'gestion', 'marketing',
        'seo', 'crm', 'hubspot', 'salesforce', 'linkedin', 'community'
    ]
    for line in lines:
        line_lower = line.lower()
        if any(kw in line_lower for kw in skill_keywords):
            if len(line) < 100:
                data["competences_cles"].append(line)

    # Secteur
    secteurs = {
        'tech': 'Tech / Informatique',
        'digital': 'Marketing Digital',
        'marketing': 'Marketing / Communication',
        'rh': 'Ressources Humaines',
        'finance': 'Finance / Comptabilité',
        'commerce': 'Commerce / Vente',
        'sante': 'Santé',
        'immobilier': 'Immobilier'
    }
    for kw, secteur in secteurs.items():
        if kw in text.lower():
            data["secteur_activite"] = secteur
            break

    return data

def insert_offer(data):
    # 1. User avec email généré si absent
    email = data.get("contact_email") or f"offre_{int(__import__('time').time())}@import.com"

    try:
        cursor.execute(
            "INSERT IGNORE INTO users (email, password, role) VALUES (%s, %s, %s)",
            (email, "default_hash", "company")
        )
        conn.commit()

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            print("Erreur: user non trouvé", file=sys.stderr)
            return
        user_id = user[0]

        # 2. Company
        entreprise = data.get("entreprise") or "Entreprise importée"
        cursor.execute(
            "INSERT INTO company_profiles (user_id, company_name, description) VALUES (%s, %s, %s)",
            (user_id, entreprise, data.get("secteur_activite") or "")
        )
        conn.commit()
        company_id = cursor.lastrowid

        # 3. Offre
        skills = ", ".join(data.get("competences_cles", []))
        ville = data["localisation"].get("ville") or ""
        dept = data["localisation"].get("departement") or ""
        location = f"{ville} - {dept}".strip(" -")

        cursor.execute(
            """INSERT INTO offers (company_id, title, location, contract_type, skills_required, json_data)
               VALUES (%s, %s, %s, %s, %s, %s)""",
            (company_id, data.get("titre_poste") or "Offre importée",
             location, data.get("type_contrat"), skills, json.dumps(data))
        )
        conn.commit()
        print(f"[SUCCESS] Offre insérée : {data.get('titre_poste')} — {entreprise}")

    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Erreur insertion: {e}", file=sys.stderr)

# MAIN
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: py extract_pdf.py <chemin_pdf>", file=sys.stderr)
        sys.exit(1)

    pdf_path = sys.argv[1]
    print(f"[INFO] Traitement de : {pdf_path}")

    text = extract_text_from_pdf(pdf_path)
    if not text:
        print("[DATA] Impossible d'extraire le texte du PDF", file=sys.stderr)
        sys.exit(1)

    data = parse_offer(text)
    print(f"[DATA] Données extraites : {json.dumps(data, ensure_ascii=False, indent=2)}")

    insert_offer(data)

    cursor.close()
    conn.close()