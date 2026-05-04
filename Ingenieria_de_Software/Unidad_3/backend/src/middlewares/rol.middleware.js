const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        ok: false,
        error: 'No autenticado'
      });
    }

    const rolUsuario = req.usuario.nombre_rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({
        ok: false,
        error: 'No tienes permisos para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = verificarRol;