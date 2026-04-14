const API_URL = 'http://localhost:3000/api';
const user = JSON.parse(localStorage.getItem('user'));
if (!user) window.location.href = 'index.html';

const token = localStorage.getItem('token');
const matchId = localStorage.getItem('current_match_id');
const matchName = localStorage.getItem('current_match_name');

// Affiche le nom du contact
document.getElementById('chat-name').textContent = matchName || 'Contact';

// Connexion Socket.io
const socket = io('http://localhost:3000');

// Rejoint avec son user_id et la room du match
socket.emit('join', user.id);
socket.emit('join_room', matchId);

// Charge les anciens messages
async function loadMessages() {
  const res = await fetch(`${API_URL}/matches/${matchId}/messages`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const json = await res.json();

  if (json.success && json.data.length > 0) {
    json.data.forEach(msg => renderMessage(msg));
    scrollToBottom();
  }
}

// Reçoit un message en temps réel
socket.on('receive_message', (message) => {
  renderMessage(message);
  scrollToBottom();
});

// Envoie un message
document.getElementById('btn-send').addEventListener('click', sendMessage);
document.getElementById('message-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('message-input');
  const content = input.value.trim();
  if (!content) return;

  socket.emit('send_message', {
    match_id: matchId,
    sender_id: user.id,
    content
  });

  input.value = '';
}

function renderMessage(msg) {
  const container = document.getElementById('messages-container');
  const isMine = msg.sender_id === user.id;

  const div = document.createElement('div');
  div.className = `message ${isMine ? 'message-mine' : 'message-other'}`;
  div.innerHTML = `
    ${!isMine ? `<p class="message-sender">${msg.sender_name || 'Contact'}</p>` : ''}
    <div class="message-bubble">${msg.content}</div>
    <p class="message-time">${new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
  `;
  container.appendChild(div);
}

function scrollToBottom() {
  const container = document.getElementById('messages-container');
  container.scrollTop = container.scrollHeight;
}

loadMessages();