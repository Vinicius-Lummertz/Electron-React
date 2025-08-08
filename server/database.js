const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Garante que a pasta 'data' exista
const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const DB_PATH = path.join(dir, 'salao.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
  }
  console.log('[database] Conectado ao banco de dados SQLite.');

  db.serialize(() => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS cargos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_cargo TEXT NOT NULL UNIQUE,
        permissoes TEXT
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha_hash TEXT NOT NULL,
        cargo_id INTEGER,
        FOREIGN KEY (cargo_id) REFERENCES cargos (id)
      );
    `);

    // --- TABELA DE CLIENTES MODIFICADA ---
    db.exec(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT,
        email TEXT UNIQUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dia_semana_padrao INTEGER, -- 0=Domingo, 1=Segunda, etc.
        horario_padrao TEXT -- Formato "HH:MM"
      );
    `);
    
    // --- TABELA DE ATENDIMENTOS MODIFICADA ---
    db.exec(`
      CREATE TABLE IF NOT EXISTS atendimentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER, -- AGORA PODE SER NULO
        cliente_nome_avulso TEXT, -- NOVO CAMPO PARA CLIENTES NÃO CADASTRADOS
        profissional_id INTEGER NOT NULL,
        servico_descricao TEXT NOT NULL,
        data_hora_inicio TEXT NOT NULL,
        data_hora_fim TEXT NOT NULL,
        status TEXT DEFAULT 'Agendado',
        FOREIGN KEY (cliente_id) REFERENCES clientes (id),
        FOREIGN KEY (profissional_id) REFERENCES usuarios (id)
      );
    `)
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        duracao_minutos INTEGER NOT NULL
      );
    `);
    ;
    
    // -- POPULANDO DADOS INICIAIS --
    const cargos = ['CEO', 'Secretaria', 'Profissional'];
    cargos.forEach(cargo => {
      db.run(`INSERT INTO cargos (nome_cargo) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM cargos WHERE nome_cargo = ?)`, [cargo, cargo]);
    });
    
    const adminEmail = 'admin@salao.com';
    const adminSenha = 'admin123';
    
    db.get(`SELECT * FROM usuarios WHERE email = ?`, [adminEmail], (err, row) => {
      if (!row) {
        bcrypt.hash(adminSenha, 10, (err, hash) => {
          if (err) return;
          db.get(`SELECT id FROM cargos WHERE nome_cargo = 'CEO'`, [], (err, cargoRow) => {
            if (cargoRow) {
              db.run(`INSERT INTO usuarios (nome, email, senha_hash, cargo_id) VALUES (?, ?, ?, ?)`, 
              ['Admin CEO', adminEmail, hash, cargoRow.id],
              (err) => {
                if(!err) console.log(`[database] Usuário padrão '${adminEmail}' criado com sucesso.`);
              });
            }
          });
        });
      }
    });
  });
});

module.exports = db;