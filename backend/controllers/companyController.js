const CompanyModel = require('../models/companyModel');

const companyController = {
  createProfile: (req, res) => {
    const { company_name, description } = req.body;
    const userId = req.user.id;

    if (!company_name) {
      return res.status(400).json({ success: false, message: 'Nom entreprise obligatoire' });
    }

    CompanyModel.create(userId, company_name, description, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err.message });

      res.status(201).json({
        success: true,
        message: 'Profil entreprise créé !',
        companyId: result.insertId
      });
    });
  },

  getProfile: (req, res) => {
    const userId = req.user.id;

    CompanyModel.findByUserId(userId, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'Profil non trouvé' });
      }
      res.json({ success: true, data: results[0] });
    });
  },
};

module.exports = companyController;