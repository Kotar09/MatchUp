const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../extractor/input'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '.pdf');
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('PDF uniquement'));
  }
});

router.get('/', offerController.getAll);
router.get('/next/:studentId', offerController.getNext);
router.get('/:id', offerController.getById);
router.post('/upload', authMiddleware, upload.single('pdf'), offerController.uploadPdf); // ← nouveau
router.get('/count/:companyId', offerController.countByCompany);

module.exports = router;