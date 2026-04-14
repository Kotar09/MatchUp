const db = require('../config/db');

const MatchModel = {

  // Récupérer les matches d'un étudiant
  getByStudent: (studentProfileId, callback) => {
    db.query(`
      SELECT 
        m.id as match_id,
        m.created_at as matched_at,
        o.id as offer_id,
        o.title as offer_title,
        o.location,
        o.contract_type,
        cp.id as company_profile_id,
        cp.company_name,
        cp.description as company_description
      FROM matches m
      JOIN offers o ON m.offer_id = o.id
      JOIN company_profiles cp ON o.company_id = cp.id
      WHERE m.student_id = ?
      ORDER BY m.created_at DESC
    `, [studentProfileId], callback);
  },

  // Récupérer les matches d'une entreprise
  getByCompany: (companyProfileId, callback) => {
    db.query(`
      SELECT 
        m.id as match_id,
        m.created_at as matched_at,
        o.id as offer_id,
        o.title as offer_title,
        sp.id as student_profile_id,
        sp.name as student_name,
        sp.title as student_title,
        sp.skills as student_skills,
        sp.education as student_education
      FROM matches m
      JOIN offers o ON m.offer_id = o.id
      JOIN student_profiles sp ON m.student_id = sp.id
      WHERE o.company_id = ?
      ORDER BY m.created_at DESC
    `, [companyProfileId], callback);
  },

  // Vérifier si un match existe déjà
  exists: (studentId, offerId, callback) => {
    db.query(
      'SELECT id FROM matches WHERE student_id = ? AND offer_id = ?',
      [studentId, offerId],
      callback
    );
  },

  // Récupérer un match par ID
  getById: (matchId, callback) => {
    db.query(
      'SELECT * FROM matches WHERE id = ?',
      [matchId],
      callback
    );
  },
};

module.exports = MatchModel;