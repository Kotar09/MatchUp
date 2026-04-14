const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Stocke les users connectés
const connectedUsers = {};

io.on('connection', (socket) => {
  console.log(`🔌 Connecté : ${socket.id}`);

  // User rejoint avec son user_id
  socket.on('join', (userId) => {
    connectedUsers[userId] = socket.id;
    console.log(`👤 User ${userId} connecté`);
  });

  // User rejoint une room de chat (par match_id)
  socket.on('join_room', (matchId) => {
    socket.join(`match_${matchId}`);
    console.log(`🚪 User rejoint room match_${matchId}`);
  });

  // Envoie un message
  socket.on('send_message', async (data) => {
    const { match_id, sender_id, content } = data;

    // Sauvegarde en BDD
    const db = require('./config/db');
    db.query(
      'INSERT INTO messages (match_id, sender_id, content) VALUES (?, ?, ?)',
      [match_id, sender_id, content],
      (err, result) => {
        if (err) {
          console.error('Erreur sauvegarde message:', err);
          return;
        }

        const message = {
          id: result.insertId,
          match_id,
          sender_id,
          content,
          created_at: new Date()
        };

        // Envoie à tous dans la room
        io.to(`match_${match_id}`).emit('receive_message', message);
        console.log(`💬 Message envoyé dans match_${match_id}`);
      }
    );
  });

  // Déconnexion
  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(connectedUsers)) {
      if (socketId === socket.id) {
        delete connectedUsers[userId];
        console.log(`❌ User ${userId} déconnecté`);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});