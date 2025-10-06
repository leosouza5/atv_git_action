const express = require('express');
const router = express.Router();

// "Banco" em memória (reinicia a cada execução)
let seq = 1;
const clientes = [];

/**
 * Validação bem simples
 */
function validaCliente(data, isUpdate = false) {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!isUpdate || data.nome !== undefined) {
    if (!data.nome || typeof data.nome !== 'string' || data.nome.trim().length < 3) {
      errors.push('nome deve ter ao menos 3 caracteres');
    }
  }
  if (!isUpdate || data.email !== undefined) {
    if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
      errors.push('email inválido');
    }
  }
  if (!isUpdate || data.telefone !== undefined) {
    if (data.telefone && typeof data.telefone !== 'string') {
      errors.push('telefone deve ser string');
    }
  }
  return errors;
}

// CREATE
router.post('/', (req, res) => {
  const errors = validaCliente(req.body);
  if (errors.length) {
    return res.status(400).json({ errors });
  }
  const novo = {
    id: seq++,
    nome: req.body.nome.trim(),
    email: req.body.email.trim().toLowerCase(),
    telefone: (req.body.telefone || '').trim(),
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  clientes.push(novo);
  res.status(201).json(novo);
});

// READ (lista com busca simples por nome/email)
router.get('/', (req, res) => {
  const { q } = req.query;
  let result = clientes;
  if (q) {
    const s = String(q).toLowerCase();
    result = clientes.filter(c => c.nome.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
  }
  res.json({ total: result.length, itens: result });
});

// READ por id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const cli = clientes.find(c => c.id === id);
  if (!cli) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(cli);
});

// UPDATE (parcial)
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const cli = clientes.find(c => c.id === id);
  if (!cli) return res.status(404).json({ error: 'Cliente não encontrado' });

  const errors = validaCliente(req.body, true);
  if (errors.length) {
    return res.status(400).json({ errors });
  }

  if (req.body.nome !== undefined) cli.nome = req.body.nome.trim();
  if (req.body.email !== undefined) cli.email = req.body.email.trim().toLowerCase();
  if (req.body.telefone !== undefined) cli.telefone = (req.body.telefone || '').trim();
  cli.atualizadoEm = new Date().toISOString();

  res.json(cli);
});

// DELETE
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = clientes.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Cliente não encontrado' });
  const [removido] = clientes.splice(idx, 1);
  res.json(removido);
});

module.exports = router;
