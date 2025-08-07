const express = require('express');
const db = require('../database');
const router = express.Router();

// Rota para LISTAR usuários (com filtro opcional por cargo): GET /api/usuarios
router.get('/', (req, res) => {
  const { cargo } = req.query;

  let sql = `
    SELECT u.id, u.nome, c.nome_cargo 
    FROM usuarios u 
    JOIN cargos c ON u.cargo_id = c.id
  `;
  const params = [];

  if (cargo) {
    sql += ` WHERE c.nome_cargo = ?`;
    params.push(cargo);
  }

  sql += ` ORDER BY u.nome`;
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erro no servidor ao buscar usuários.", error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;