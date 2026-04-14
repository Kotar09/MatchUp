const API_URL = 'http://localhost:3000/api';

document.getElementById('btn-submit').addEventListener('click', async () => {
  const companyName = document.getElementById('company-name').value.trim();
  const sector = document.getElementById('sector').value.trim();
  const description = document.getElementById('description').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!companyName || !email || !password) {
    showError('Nom, email et mot de passe sont obligatoires');
    return;
  }

  try {
    // 1. Register
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'company' })
    });

    const registerData = await registerRes.json();
    if (!registerData.success) {
      showError(registerData.message);
      return;
    }

    // 2. Sauvegarde token
    localStorage.setItem('token', registerData.token);
    localStorage.setItem('user', JSON.stringify(registerData.user));

    // 3. Crée le profil entreprise
    const profileRes = await fetch(`${API_URL}/companies/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${registerData.token}`
      },
      body: JSON.stringify({
        company_name: companyName,
        description: `${sector} — ${description}`
      })
    });

    const profileData = await profileRes.json();
    if (!profileData.success) {
      showError(profileData.message);
      return;
    }

    // 4. Redirige vers dashboard entreprise
    window.location.href = 'company-dashboard.html';

  } catch (err) {
    showError('Erreur serveur, réessaie');
  }
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}