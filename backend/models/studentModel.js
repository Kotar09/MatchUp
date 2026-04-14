const db = require('../config/db');

const StudentModel = {
  create: (userId, name, title, skills, education, callback) => {
    db.query(
      `INSERT INTO student_profiles (user_id, name, title, skills, education)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, name, title, skills, education],
      callback
    );
  },

  findByUserId: (userId, callback) => {
    db.query(
      'SELECT * FROM student_profiles WHERE user_id = ?',
      [userId],
      callback
    );
  },
};

module.exports = StudentModel;