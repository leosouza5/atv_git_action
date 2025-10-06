const request = require('supertest');
const app = require('../src/app');

describe('CRUD de Clientes', () => {
  let criado;

  test('POST /clientes -> cria cliente válido', async () => {
    const res = await request(app)
      .post('/clientes')
      .send({ nome: 'Maria Silva', email: 'maria@exemplo.com', telefone: '6799999-0000' })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.nome).toBe('Maria Silva');
    expect(res.body.email).toBe('maria@exemplo.com');
    criado = res.body;
  });

  test('POST /clientes -> validação de payload ruim', async () => {
    const res = await request(app)
      .post('/clientes')
      .send({ nome: 'Ma', email: 'invalido' })
      .expect(400);
    expect(res.body.errors).toContain('nome deve ter ao menos 3 caracteres');
    expect(res.body.errors).toContain('email inválido');
  });

  test('GET /clientes -> lista clientes', async () => {
    const res = await request(app).get('/clientes').expect(200);
    expect(res.body.total).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.itens)).toBe(true);
  });

  test('GET /clientes/:id -> retorna cliente por id', async () => {
    const res = await request(app).get(`/clientes/${criado.id}`).expect(200);
    expect(res.body.id).toBe(criado.id);
  });

  test('PATCH /clientes/:id -> atualiza parcialmente', async () => {
    const res = await request(app)
      .patch(`/clientes/${criado.id}`)
      .send({ telefone: '6798888-1111' })
      .expect(200);
    expect(res.body.telefone).toBe('6798888-1111');
  });

  test('DELETE /clientes/:id -> remove cliente', async () => {
    const res = await request(app).delete(`/clientes/${criado.id}`).expect(200);
    expect(res.body.id).toBe(criado.id);

    await request(app).get(`/clientes/${criado.id}`).expect(404);
  });
});
