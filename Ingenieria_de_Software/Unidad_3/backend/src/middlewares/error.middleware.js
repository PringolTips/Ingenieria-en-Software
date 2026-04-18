const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    ok: false,
    error: err.message || 'Error interno del servidor',
    campos: err.campos || null
  });
};

module.exports = errorHandler;