const MatchModel = require('../models/matchModel');
const db = require('../config/db');

const matchController = {

  // GET /api/matches/student
  getStudentMatches: (req, res) => {
    const userId = req.user.id;

    // Récupère le student_profile_id
    db.query(
      'SELECT id FROM student_profiles WHERE user_id = ?',
      [userId],
      (err, students) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (students.length === 0) {
          return res.status(404).json({ success: false, message: 'Profil étudiant non trouvé' });
        }

        const studentProfileId = students[0].id;

        MatchModel.getByStudent(studentProfileId, (err, results) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          res.json({ success: true, data: results });
        });
      }
    );
  },

  // GET /api/matches/company
  getCompanyMatches: (req, res) => {
    const userId = req.user.id;

    // Récupère le company_profile_id
    db.query(
      'SELECT id FROM company_profiles WHERE user_id = ?',
      [userId],
      (err, companies) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (companies.length === 0) {
          return res.status(404).json({ success: false, message: 'Profil entreprise non trouvé' });
        }

        const companyProfileId = companies[0].id;

        MatchModel.getByCompany(companyProfileId, (err, results) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          res.json({ success: true, data: results });
        });
      }
    );
  },

  // GET /api/matches/count/student
  countStudentMatches: (req, res) => {
    const userId = req.user.id;

    db.query(
      'SELECT id FROM student_profiles WHERE user_id = ?',
      [userId],
      (err, students) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (students.length === 0) return res.json({ success: true, total: 0 });

        db.query(
          'SELECT COUNT(*) as total FROM matches WHERE student_id = ?',
          [students[0].id],
          (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, total: results[0].total });
          }
        );
      }
    );
  },

  // GET /api/matches/count/company
  countCompanyMatches: (req, res) => {
    const userId = req.user.id;

    db.query(
      'SELECT id FROM company_profiles WHERE user_id = ?',
      [userId],
      (err, companies) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (companies.length === 0) return res.json({ success: true, total: 0 });

        db.query(`
          SELECT COUNT(*) as total 
          FROM matches m
          JOIN offers o ON m.offer_id = o.id
          WHERE o.company_id = ?
        `, [companies[0].id],
          (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true, total: results[0].total });
          }
        );
      }
    );
  },
};

module.exports = matchController;