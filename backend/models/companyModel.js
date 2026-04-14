const db = require('../config/db');

const CompanyModel = {
  create: (userId, companyName, description, callback) => {
    db.query(
      `INSERT INTO company_profiles (user_id, company_name, description)
       VALUES (?, ?, ?)`,
      [userId, companyName, description],
      callback
    );
  },

  findByUserId: (userId, callback) => {
    db.query(
      'SELECT * FROM company_profiles WHERE user_id = ?',
      [userId],
      callback
    );
  },
};

module.exports = CompanyModel;