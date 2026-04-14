const API_URL = 'http://localhost:3000/api';

document.getElementById('btn-submit').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    showError('Email et mot de passe obligatoires');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.success) {
      showError(data.message);
      return;
    }

    // Sauvegarde token et user
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    
    // ← Remplace window.location.href = 'swipe.html'
    if (data.user.role === 'student') {
      window.location.href = 'swipe.html';
    } else if (data.user.role === 'company') {
      window.location.href = 'company-dashboard.html';
    }

  } catch (err) {
    showError('Erreur serveur, réessaie');
  }
});

function showError(msg) {
  const el = document.getElementById('error-msg');
  el.textContent = msg;
  el.classList.remove('hidden');
}