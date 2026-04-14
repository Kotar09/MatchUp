const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } disponible dans tous les controllers
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token expiré ou invalide' });
  }
};

module.exports = authMiddleware;