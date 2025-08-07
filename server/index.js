const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRoutes = require('./routes/auth');
const cargoRoutes = require('./routes/cargos');
const clienteRoutes = require('./routes/clientes');
const atendimentoRoutes = require('./routes/atendimentos');
const usuarioRoutes = require('./routes/usuarios'); // Importa

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Rotas da API ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor Express está funcionando!' });
});

// Usando as rotas com seus prefixos
app.use('/api/auth', authRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/atendimentos', atendimentoRoutes);
app.use('/api/usuarios', usuarioRoutes); // Registra

// --- Iniciar o servidor ---
app.listen(PORT, () => {
  console.log(`[server] Servidor Express iniciado em http://localhost:${PORT}`);
});