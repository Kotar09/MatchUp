const StudentModel = require('../models/studentModel');

const studentController = {
  createProfile: (req, res) => {
    const { name, title, skills, education } = req.body;
    const userId = req.user.id; // vient du token JWT via authMiddleware

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nom obligatoire' });
    }

    StudentModel.create(userId, name, title, skills, education, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      res.status(201).json({
        success: true,
        message: 'Profil créé !',
        studentId: result.insertId
      });
    });
  },

  getProfile: (req, res) => {
    const userId = req.user.id;

    StudentModel.findByUserId(userId, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Profil non trouvé' });
      }
      res.json({ success: true, data: results[0] });
    });
  },
};

module.exports = studentController;