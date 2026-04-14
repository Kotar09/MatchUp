const API_URL = 'http://localhost:3000/api';
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'company') window.location.href = 'index.html';

const COMPANY_USER_ID = user.id;

let currentStudent = null;
let startX = 0;
let isDragging = false;

const card = document.getElementById('card');
const noMore = document.getElementById('no-more');

async function loadNextStudent() {
  try {
    const res = await fetch(`${API_URL}/students/next/${COMPANY_USER_ID}`);
    const json = await res.json();

    if (!json.data || json.message) {
      card.classList.add('hidden');
      noMore.classList.remove('hidden');
      return;
    }

    currentStudent = json.data;
    renderCard(currentStudent);
  } catch (err) {
    console.error('Erreur chargement étudiant:', err);
  }
}

function renderCard(student) {
  document.getElementById('student-name').textContent = student.name;
  document.getElementById('student-title').textContent = student.title;
  document.querySelector('#student-education span').textContent = student.education;

  // Initiales dans l'avatar
  const initials = student.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('student-avatar').textContent = initials;

  const skillsContainer = document.getElementById('skills');
  skillsContainer.innerHTML = '';
  const skills = student.skills?.split(',') ?? [];
  skills.slice(0, 6).forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill.trim();
    skillsContainer.appendChild(tag);
  });

  card.style.transform = '';
  card.classList.remove('swipe-left', 'swipe-right', 'hidden');
}

async function swipe(direction) {
  if (!currentStudent) return;

  await fetch(`${API_URL}/swipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: COMPANY_USER_ID,
      target_id: currentStudent.id,
      target_type: 'student',
      direction: direction
    })
  });

  launchFireworks(direction);
  card.classList.add(direction === 'like' ? 'swipe-right' : 'swipe-left');

  setTimeout(() => loadNextStudent(), 600);
}

// Boutons
document.getElementById('btn-like').addEventListener('click', () => swipe('like'));
document.getElementById('btn-dislike').addEventListener('click', () => swipe('dislike'));

// Drag
card.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  card.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const diff = e.clientX - startX;
  card.style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
});

document.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  card.classList.remove('dragging');
  const diff = e.clientX - startX;
  if (diff > 100) swipe('like');
  else if (diff < -100) swipe('dislike');
  else card.style.transform = '';
});

// Reset
document.getElementById('btn-reset').addEventListener('click', async () => {
  await fetch(`${API_URL}/swipes/reset/${COMPANY_USER_ID}`, { method: 'DELETE' });
  card.classList.remove('hidden');
  noMore.classList.add('hidden');
  loadNextStudent();
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

// Feux d'artifice
function launchFireworks(direction) {
  const color = direction === 'like' ? '#2ecc71' : '#e74c3c';
  const emoji = direction === 'like' ? '♥' : '✕';
  const count = direction === 'like' ? 18 : 12;
  for (let i = 0; i < count; i++) createParticle(color, emoji, i, count);
}

function createParticle(color, emoji, index, total) {
  const particle = document.createElement('div');
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const angle = (index / total) * 360 + Math.random() * 20;
  const distance = 80 + Math.random() * 140;
  const rad = (angle * Math.PI) / 180;
  const endX = Math.cos(rad) * distance;
  const endY = Math.sin(rad) * distance;

  particle.style.cssText = `
    position: fixed;
    left: ${cx}px;
    top: ${cy}px;
    font-size: ${14 + Math.random() * 14}px;
    color: ${color};
    pointer-events: none;
    z-index: 9999;
    font-weight: 900;
    opacity: 1;
    transform: translate(-50%, -50%);
  `;

  particle.textContent = Math.random() > 0.5 ? emoji : '●';
  document.body.appendChild(particle);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      particle.style.transition = `all ${0.5 + Math.random() * 0.4}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      particle.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) scale(${0.3 + Math.random() * 0.7})`;
      particle.style.opacity = '0';
    });
  });

  setTimeout(() => particle.remove(), 1000);
}

loadNextStudent();