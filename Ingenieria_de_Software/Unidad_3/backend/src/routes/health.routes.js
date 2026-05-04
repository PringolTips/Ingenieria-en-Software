const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'DIGICLIN API funcionando',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;