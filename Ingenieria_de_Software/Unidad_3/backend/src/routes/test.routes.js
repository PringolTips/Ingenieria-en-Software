const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      ok: true,
      fecha: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      error: 'Error conectando a la base de datos'
    });
  }
});

module.exports = router;