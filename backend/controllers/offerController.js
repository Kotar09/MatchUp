const OfferModel = require('../models/offerModel');
const { spawn } = require('child_process');
const path = require('path');

const offerController = {
  getAll: (req, res) => {
    OfferModel.getAll((err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      res.json({ success: true, data: results });
    });
  },

  getById: (req, res) => {
    OfferModel.getById(req.params.id, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) return res.status(404).json({ success: false, message: 'Offre non trouvée' });
      res.json({ success: true, data: results[0] });
    });
  },

  getNext: (req, res) => {
    const studentId = req.params.studentId;
    OfferModel.getNextForStudent(studentId, (err, results) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      if (results.length === 0) return res.json({ success: true, message: 'Plus aucune offre disponible' });
      res.json({ success: true, data: results[0] });
    });
  },

  // ← NOUVEAU
  uploadPdf: (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucun fichier reçu' });
    }

    const pdfPath = req.file.path;
    const scriptPath = path.join(__dirname, '../../extractor/extract_pdf.py');

    console.log(`🐍 Lancement Python sur : ${pdfPath}`);

    const python = spawn('py', [scriptPath, pdfPath]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python stderr:', data.toString());
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({
          success: false,
          message: 'Erreur traitement PDF',
          error: errorOutput
        });
      }
      console.log('✅ Python terminé:', output);
      res.json({ success: true, message: 'Offre traitée et insérée en BDD !' });
    });
  },
  countByCompany: (req, res) => {
  const companyId = req.params.companyId;
  OfferModel.countByCompany(companyId, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, total: results[0].total });
  });
},
};



module.exports = offerController;