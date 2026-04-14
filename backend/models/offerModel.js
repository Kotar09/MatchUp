// models/offerModel.js
const db = require('../config/db');

const OfferModel = {
  getAll: (callback) => {
    const query = `
      SELECT 
        o.id,
        o.title,
        o.location,
        o.contract_type,
        o.skills_required,
        o.created_at,
        cp.company_name
      FROM offers o
      JOIN company_profiles cp ON o.company_id = cp.id
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
  const query = `
    SELECT 
      o.id,
      o.title,
      o.location,
      o.contract_type,
      o.skills_required,
      o.created_at,
      cp.company_name
    FROM offers o
    JOIN company_profiles cp ON o.company_id = cp.id
    WHERE o.id = ?
  `;
  db.query(query, [id], callback);
},
  getNextForStudent: (studentId, callback) => {
  const query = `
    SELECT 
      o.id,
      o.title,
      o.location,
      o.contract_type,
      o.skills_required,
      o.json_data,
      cp.company_name
    FROM offers o
    JOIN company_profiles cp ON o.company_id = cp.id
    WHERE o.id NOT IN (
      SELECT target_id FROM swipes 
      WHERE user_id = ? AND target_type = 'offer'
    )
    ORDER BY RAND()
    LIMIT 1
  `;
  db.query(query, [studentId], callback);
},

countByCompany: (companyId, callback) => {
  db.query(
    'SELECT COUNT(*) as total FROM offers WHERE company_id = ?',
    [companyId],
    callback
  );
},

};


module.exports = OfferModel;