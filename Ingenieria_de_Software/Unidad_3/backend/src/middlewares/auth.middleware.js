const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        error: 'Token no proporcionado'
      });
    }

    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
      return res.status(401).json({
        ok: false,
        error: 'Formato de token inválido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      error: 'Token inválido o expirado'
    });
  }
};

module.exports = verificarToken;