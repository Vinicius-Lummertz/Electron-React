const express = require('express');
const db = require('../database');
const router = express.Router();

// Rota para CRIAR um novo cliente: POST /api/clientes
router.post('/', (req, res) => {
  const { nome, telefone, email, dia_semana_padrao, horario_padrao } = req.body;
  if (!nome) {
    return res.status(400).json({ message: "O nome do cliente é obrigatório." });
  }
  const sql = `INSERT INTO clientes (nome, telefone, email, dia_semana_padrao, horario_padrao) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [nome, telefone, email, dia_semana_padrao, horario_padrao], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao cadastrar cliente.", error: err.message });
    }
    res.status(201).json({ id: this.lastID, nome, telefone, email });
  });
});

// Rota para LISTAR todos os clientes: GET /api/clientes
router.get('/', (req, res) => {
  const sql = `SELECT * FROM clientes ORDER BY nome`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar clientes.", error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;