const express = require('express');
const clientesRouter = require('./routes/clientes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Clientes' });
});

app.use('/clientes', clientesRouter);

// Middleware simples de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
