const express = require('express');
const db = require('../database');
const router = express.Router();

// LISTAR todos os serviços
router.get('/', (req, res) => {
  db.all(`SELECT * FROM servicos ORDER BY nome`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CRIAR um novo serviço
router.post('/', (req, res) => {
  const { nome, duracao_minutos } = req.body;
  if (!nome || !duracao_minutos) {
    return res.status(400).json({ error: 'Nome e duração são obrigatórios.' });
  }
  db.run(`INSERT INTO servicos (nome, duracao_minutos) VALUES (?, ?)`, [nome, duracao_minutos], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, nome, duracao_minutos });
  });
});

// EXCLUIR um serviço
router.delete('/:id', (req, res) => {
  db.run(`DELETE FROM servicos WHERE id = ?`, req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ deleted: this.changes });
  });
});

module.exports = router;