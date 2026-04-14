# extractor/extract.py
import json
import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

conn = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = conn.cursor()

def insert_offer(data):
    # 1. User
    cursor.execute(
        "INSERT IGNORE INTO users (email, password, role) VALUES (%s, %s, %s)",
        (data.get("contact_email", f"{data['entreprise']}@import.com"), "default_hash", "company")
    )
    user_id = cursor.lastrowid

    # 2. Company
    cursor.execute(
        "INSERT IGNORE INTO company_profiles (user_id, company_name, description) VALUES (%s, %s, %s)",
        (user_id, data["entreprise"], data.get("secteur_activite", ""))
    )
    company_id = cursor.lastrowid

    # 3. Offre
    skills = ", ".join(data.get("competences_cles", []))
    location = f"{data['localisation']['ville']} - {data['localisation']['departement']}"

    cursor.execute(
        """INSERT IGNORE INTO offers (company_id, title, location, contract_type, skills_required, json_data)
           VALUES (%s, %s, %s, %s, %s, %s)""",
        (company_id, data["titre_poste"], location, data["type_contrat"], skills, json.dumps(data))
    )

    conn.commit()
    print(f"✅ Offre insérée : {data['titre_poste']} - {data['entreprise']}")

# Lit tous les JSON du dossier /output
output_dir = os.path.join(os.path.dirname(__file__), "output")

for filename in os.listdir(output_dir):
    if filename.endswith(".json"):
        with open(os.path.join(output_dir, filename), "r", encoding="utf-8") as f:
            data = json.load(f)
            insert_offer(data)

cursor.close()
conn.close()
print("\n🎉 Import terminé !")