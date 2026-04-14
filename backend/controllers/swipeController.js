const SwipeModel = require('../models/swipeModel');
const db = require('../config/db');

const swipeController = {
  create: (req, res) => {
    const { user_id, target_id, target_type, direction } = req.body;

    // Validation basique
    if (!user_id || !target_id || !target_type || !direction) {
      return res.status(400).json({ success: false, message: 'Champs manquants' });
    }

    SwipeModel.create(user_id, target_id, target_type, direction, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      // Si c'est un like sur une offre → on vérifie le match
      if (direction === 'like' && target_type === 'offer') {
        // Récupère le student_profile lié au user
        db.query(
          'SELECT id FROM student_profiles WHERE user_id = ?',
          [user_id],
          (err, students) => {
            if (err || students.length === 0) {
              return res.json({ success: true, match: false });
            }

            const studentProfileId = students[0].id;

            // Crée le match automatiquement
            db.query(
              'INSERT INTO matches (student_id, offer_id) VALUES (?, ?)',
              [studentProfileId, target_id],
              (err) => {
                if (err) return res.json({ success: true, match: false });
                res.json({ success: true, match: true, message: '🎉 Match !' });
              }
            );
          }
        );
      } else {
        res.json({ success: true, match: false });
      }
    });
  },
    getLikedOffers: (req, res) => {
    SwipeModel.getLikedOffers(req.params.userId, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: results });
    });
  },
};

module.exports = swipeController;