const API_URL = 'http://localhost:3000/api';
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'index.html';

const token = localStorage.getItem('token');

async function loadMatches() {
  const res = await fetch(`${API_URL}/matches/student`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();

  const container = document.getElementById('matches-container');
  const emptyState = document.getElementById('empty-state');
  const count = document.getElementById('matches-count');

  if (!json.data || json.data.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  count.textContent = `${json.data.length} match${json.data.length > 1 ? 'es' : ''}`;
  count.classList.remove('hidden');

  json.data.forEach(match => {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.innerHTML = `
      <div class="match-card-top">
        <div class="match-company-logo">🏢</div>
        <div class="match-badge">Match ♥</div>
      </div>
      <div class="match-card-body">
        <h3>${match.company_name}</h3>
        <p class="match-offer-title">${match.offer_title}</p>
        <p class="match-location">📍 ${match.location}</p>
        <p class="match-contract">${match.contract_type}</p>
      </div>
      <div class="match-card-footer">
        <span class="match-date">Matché le ${new Date(match.matched_at).toLocaleDateString('fr-FR')}</span>
        <button class="btn-chat" onclick="openChat(${match.match_id}, '${match.company_name}')">
          💬 Envoyer un message
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openChat(matchId, companyName) {
  localStorage.setItem('current_match_id', matchId);
  localStorage.setItem('current_match_name', companyName);
  window.location.href = `chat.html`;
}

document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

loadMatches();