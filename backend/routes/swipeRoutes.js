const express = require('express');
const router = express.Router();
const swipeController = require('../controllers/swipeController');

router.post('/', swipeController.create);

router.get('/likes/:userId', swipeController.getLikedOffers); // ← AJOUTE

router.delete('/reset/:userId', (req, res) => {
  db.query('DELETE FROM swipes WHERE user_id = ?', [req.params.userId], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

module.exports = router;