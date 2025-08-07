const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const JWT_SECRET = 'seu_segredo_super_secreto_aqui';

// Rota de Cadastro: POST /api/auth/register
router.post('/register', (req, res) => {
  const { nome, email, password, cargo_id } = req.body;

  if (!nome || !email || !password || !cargo_id) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se o usuário já existe
  db.get(`SELECT email FROM usuarios WHERE email = ?`, [email], (err, row) => {
    if (row) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    // Hash da senha
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao processar senha.' });
      }

      const sql = `INSERT INTO usuarios (nome, email, senha_hash, cargo_id) VALUES (?, ?, ?, ?)`;
      db.run(sql, [nome, email, hash, cargo_id], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao registrar usuário.' });
        }
        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: this.lastID });
      });
    });
  });
});

// Rota de Login: POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const sql = `
    SELECT u.id, u.nome, u.email, u.senha_hash, c.nome_cargo 
    FROM usuarios u 
    JOIN cargos c ON u.cargo_id = c.id 
    WHERE u.email = ?
  `;

  db.get(sql, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    bcrypt.compare(password, user.senha_hash, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao verificar senha.' });
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta.' });
      }

      const payload = {
        id: user.id,
        nome: user.nome,
        cargo: user.nome_cargo
      };

      jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: payload
        });
      });
    });
  });
});

module.exports = router;