const API_URL = 'http://localhost:3000/api';
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = '../pages/index.html';

async function loadLikes() {
  const res = await fetch(`${API_URL}/swipes/likes/${user.id}`);
  const json = await res.json();

  const container = document.getElementById('likes-container');
  const emptyMsg = document.getElementById('empty-msg');
const likesCount = document.getElementById('likes-count'); 

  if (!json.data || json.data.length === 0) {
    emptyMsg.classList.remove('hidden');
    return;
  }

  // Affiche le compteur
 if (likesCount) {
    likesCount.textContent = `${json.data.length} offre${json.data.length > 1 ? 's' : ''} likée${json.data.length > 1 ? 's' : ''}`;
    likesCount.classList.remove('hidden');
  }

  json.data.forEach(offer => {
    const card = document.createElement('div');
    card.className = 'like-card';
    card.innerHTML = `
      <div class="like-card-header">
        <div class="like-card-badges">
          <span class="company-badge">${offer.company_name}</span>
          <span class="contract-badge">${offer.contract_type}</span>
        </div>
        <span class="like-heart">♥</span>
      </div>
      <h3>${offer.title}</h3>
      <p class="location">📍 ${offer.location}</p>
      <div class="skills">
        ${offer.skills_required.split(',').slice(0, 4).map(s =>
          `<span class="skill-tag">${s.trim()}</span>`
        ).join('')}
      </div>
    `;
    container.appendChild(card);
  });
  
  json.data.forEach(offer => {
    const card = document.createElement('div');
    card.className = 'like-card';
    card.innerHTML = `
      <div class="like-card-header">
        <span class="company-badge">${offer.company_name}</span>
        <span class="contract-badge">${offer.contract_type}</span>
      </div>
      <h3>${offer.title}</h3>
      <p class="location">📍 ${offer.location}</p>
      <div class="skills">
        ${offer.skills_required.split(',').slice(0, 4).map(s =>
          `<span class="skill-tag">${s.trim()}</span>`
        ).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

loadLikes();