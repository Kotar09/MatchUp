const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authController = {
  register: (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Champs manquants' });
    }

    // Vérifie si l'email existe déjà
    UserModel.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Email déjà utilisé' });
      }

      // Hash du mot de passe
      const hashedPassword = bcrypt.hashSync(password, 10);

      UserModel.create(email, hashedPassword, role, (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        const token = jwt.sign(
          { id: result.insertId, role },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({
          success: true,
          message: 'Compte créé !',
          token,
          user: { id: result.insertId, email, role }
        });
      });
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Champs manquants' });
    }

    UserModel.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const user = results[0];
      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Connecté !',
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    });
  },
};

module.exports = authController;