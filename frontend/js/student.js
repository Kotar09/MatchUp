const API_URL = 'http://localhost:3000/api';

document.getElementById('btn-submit').addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  const title = document.getElementById('title').value.trim();
  const skills = document.getElementById('skills').value.trim();
  const education = document.getElementById('education').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !email || !password) {
    showError('Nom, email et mot de passe sont obligatoires');
    return;
  }

  try {
    // 1. Register
    const registerRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role: 'student' })
    });

    const registerData = await registerRes.json();
    if (!registerData.success) {
      showError(registerData.message);
      return;
    }

    // 2. Sauvegarde le token
    localStorage.setItem('token', registerData.token);
    localStorage.setItem('user', JSON.stringify(registerData.user));

    // 3. Crée le profil étudiant
    const profileRes = await fetch(`${API_URL}/students/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${registerData.token}`
      },
      body: JSON.stringify({ name, title, skills, education })
    });

    const profileData = await profileRes.json();
    if (!profileData.success) {
      showError(profileData.message);
      return;
    }

    // 4. Redirige vers le swipe
    window.location.href = 'swipe.html';

  } catch (err) {
    showError('Erreur serveur, réessaie');
  }
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}