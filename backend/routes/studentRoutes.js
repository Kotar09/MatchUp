const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const db = require('../config/db'); // ← ajoute cette ligne

router.post('/profile', authMiddleware, studentController.createProfile);
router.get('/profile', authMiddleware, studentController.getProfile);

router.get('/next/:companyUserId', (req, res) => {
  db.query(`
    SELECT 
      sp.id,
      sp.name,
      sp.title,
      sp.skills,
      sp.education
    FROM student_profiles sp
    WHERE sp.user_id NOT IN (
      SELECT s.user_id FROM swipes sw
      JOIN student_profiles s ON sw.target_id = s.id
      WHERE sw.user_id = ? AND sw.target_type = 'student'
    )
    ORDER BY RAND()
    LIMIT 1
  `, [req.params.companyUserId], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0) return res.json({ success: true, message: 'Plus aucun étudiant disponible' });
    res.json({ success: true, data: results[0] });
  });
});

module.exports = router;