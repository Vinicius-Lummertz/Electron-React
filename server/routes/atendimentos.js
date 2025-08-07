const express = require('express');
const db = require('../database');
const router = express.Router();

// Rota para CRIAR um novo atendimento: POST /api/atendimentos
router.post('/', (req, res) => {
  const { cliente_id, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim } = req.body;

  if(!cliente_id || !profissional_id || !servico_descricao || !data_hora_inicio || !data_hora_fim) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  const sql = `INSERT INTO atendimentos (cliente_id, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [cliente_id, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao agendar atendimento.", error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Rota para LISTAR atendimentos (ex: por período): GET /api/atendimentos
router.get('/', (req, res) => {
    // Para a query, juntamos as tabelas para pegar os nomes do cliente e profissional
    const sql = `
        SELECT 
            a.id,
            a.servico_descricao,
            a.data_hora_inicio,
            a.status,
            c.nome as cliente_nome,
            u.nome as profissional_nome
        FROM atendimentos a
        JOIN clientes c ON a.cliente_id = c.id
        JOIN usuarios u ON a.profissional_id = u.id
        ORDER BY a.data_hora_inicio
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar atendimentos.", error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;