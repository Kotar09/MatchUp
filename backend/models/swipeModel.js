const db = require('../config/db');

const SwipeModel = {
  // Enregistrer un swipe
  create: (userId, targetId, targetType, direction, callback) => {
    const query = `
      INSERT INTO swipes (user_id, target_id, target_type, direction)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [userId, targetId, targetType, direction], callback);
  },

  // Vérifier si un match existe (les deux ont liké)
  checkMatch: (studentId, offerId, callback) => {
    const query = `
      SELECT * FROM swipes
      WHERE user_id = ? AND target_id = ? AND target_type = 'offer' AND direction = 'like'
    `;
    db.query(query, [studentId, offerId], callback);
  },
  getLikedOffers: (userId, callback) => {
    db.query(`
      SELECT 
        o.id,
        o.title,
        o.location,
        o.contract_type,
        o.skills_required,
        cp.company_name
      FROM swipes s
      JOIN offers o ON s.target_id = o.id
      JOIN company_profiles cp ON o.company_id = cp.id
      WHERE s.user_id = ? AND s.direction = 'like' AND s.target_type = 'offer'
      ORDER BY s.created_at DESC
    `, [userId], callback);
  },
};

module.exports = SwipeModel;