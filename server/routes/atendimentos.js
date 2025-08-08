const express = require('express');
const db = require('../database');
const router = express.Router();

// Rota para CRIAR um novo atendimento: POST /api/atendimentos
router.post('/', (req, res) => {
  const { cliente_id, cliente_nome_avulso, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim } = req.body;

  if (!(cliente_id || cliente_nome_avulso) || !profissional_id || !servico_descricao || !data_hora_inicio || !data_hora_fim) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }

  const sql = `INSERT INTO atendimentos (cliente_id, cliente_nome_avulso, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [cliente_id || null, cliente_nome_avulso || null, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao agendar atendimento.", error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Rota para LISTAR atendimentos: GET /api/atendimentos
router.get('/', (req, res) => {
    const sql = `
        SELECT 
            a.id,
            a.servico_descricao,
            a.data_hora_inicio,
            a.data_hora_fim,
            a.status,
            a.cliente_id,
            a.profissional_id,
            COALESCE(c.nome, a.cliente_nome_avulso) as cliente_nome,
            u.nome as profissional_nome
        FROM atendimentos a
        LEFT JOIN clientes c ON a.cliente_id = c.id
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

// --- NOVAS ROTAS ---

// Rota para ATUALIZAR um atendimento: PUT /api/atendimentos/:id
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { cliente_id, cliente_nome_avulso, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim, status } = req.body;

    const sql = `
        UPDATE atendimentos SET
            cliente_id = ?,
            cliente_nome_avulso = ?,
            profissional_id = ?,
            servico_descricao = ?,
            data_hora_inicio = ?,
            data_hora_fim = ?,
            status = ?
        WHERE id = ?
    `;
    db.run(sql, [cliente_id || null, cliente_nome_avulso || null, profissional_id, servico_descricao, data_hora_inicio, data_hora_fim, status, id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao atualizar atendimento.", error: err.message });
        }
        res.status(200).json({ message: "Atendimento atualizado com sucesso", changes: this.changes });
    });
});

// Rota para EXCLUIR um atendimento: DELETE /api/atendimentos/:id
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM atendimentos WHERE id = ?`;
    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao excluir atendimento.", error: err.message });
        }
        res.status(200).json({ message: "Atendimento excluído com sucesso", changes: this.changes });
    });
});


module.exports = router;