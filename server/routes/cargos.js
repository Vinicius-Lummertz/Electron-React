const express = require('express');
const db = require('../database');
const router = express.Router();

// Rota para buscar todos os cargos: GET /api/cargos
router.get('/', (req, res) => {
  const sql = `SELECT id, nome_cargo FROM cargos ORDER BY nome_cargo`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: "Erro no servidor ao buscar cargos." });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;