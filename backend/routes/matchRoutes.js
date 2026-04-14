const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/student', authMiddleware, matchController.getStudentMatches);
router.get('/company', authMiddleware, matchController.getCompanyMatches);
router.get('/count/student', authMiddleware, matchController.countStudentMatches);
router.get('/count/company', authMiddleware, matchController.countCompanyMatches);

// Récupère les messages d'un match
router.get('/:matchId/messages', authMiddleware, (req, res) => {
  db.query(`
    SELECT 
      m.id,
      m.content,
      m.created_at,
      m.sender_id,
      u.email as sender_email,
      COALESCE(sp.name, cp.company_name) as sender_name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    LEFT JOIN company_profiles cp ON u.id = cp.user_id
    WHERE m.match_id = ?
    ORDER BY m.created_at ASC
  `, [req.params.matchId], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, data: results });
  });
});

module.exports = router;