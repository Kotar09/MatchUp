const API_URL = 'http://localhost:3000/api';
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'company') window.location.href = 'index.html';

// Charge le profil entreprise
async function loadProfile() {
  const token = localStorage.getItem('token');

  // Profil entreprise
  const res = await fetch(`${API_URL}/companies/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();

  if (json.success) {
    document.getElementById('company-name').textContent = json.data.company_name + ' !';
    document.getElementById('company-label').textContent = '🏢 ' + json.data.company_name;

    // ← Compte les offres
    await loadOffersCount(json.data.id);
  }
}

async function loadOffersCount(companyId) {
  const res = await fetch(`${API_URL}/offers/count/${companyId}`);
  const json = await res.json();
  if (json.success) {
    document.getElementById('offers-count').textContent = json.total;
  }
}

// Upload PDF
const uploadZone = document.getElementById('upload-zone');
const pdfInput = document.getElementById('pdf-input');
const uploadPreview = document.getElementById('upload-preview');
const uploadSuccess = document.getElementById('upload-success');
let selectedFile = null;

// Clic sur le label
pdfInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});


// Drag & drop
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') handleFile(file);
});

function handleFile(file) {
  selectedFile = file;
  document.getElementById('file-name').textContent = file.name;
  document.getElementById('file-size').textContent = (file.size / 1024).toFixed(1) + ' Ko';
  uploadZone.classList.add('hidden');
  uploadPreview.classList.remove('hidden');
}

// Supprimer le fichier
document.getElementById('btn-remove').addEventListener('click', () => {
  selectedFile = null;
  pdfInput.value = '';
  uploadPreview.classList.add('hidden');
  uploadZone.classList.remove('hidden');
});

// Envoyer le PDF
document.getElementById('btn-send').addEventListener('click', async () => {
  if (!selectedFile) return;

  const formData = new FormData();
  formData.append('pdf', selectedFile);
  formData.append('company_id', user.id);

  try {
    const btn = document.getElementById('btn-send');
    btn.textContent = 'Envoi en cours...';
    btn.disabled = true;

    const res = await fetch(`${API_URL}/offers/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData
    });

    const json = await res.json();
    if (json.success) {
      uploadPreview.classList.add('hidden');
      uploadSuccess.classList.remove('hidden');
       await loadProfile();
    }
  } catch (err) {
    console.error('Erreur upload:', err);
  }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

loadProfile();