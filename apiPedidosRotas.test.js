const request = require('supertest');
const app = require('./apiPedidosRotas');

const pedidosTeste = [
  {
    endereco: { latitude: -23.5505, longitude: -46.6333 },
    produto: 'Meias',
    quantidade: 2
  },
  {
    endereco: { latitude: -23.5505, longitude: -46.6333 },
    produto: 'Camisetas',
    quantidade: 5
  },
  {
    endereco: { latitude: -23.5505, longitude: -46.6333 },
    produto: 'Calça',
    quantidade: 1
  }
];

const rotasTeste = [
  { latitude: -23.5505, longitude: -46.6333 },
  { latitude: -23.5505, longitude: -46.6334 }
];

describe('Pedidos e Rotas API', () => {
  beforeEach(async () => {
    
    let pedidos = pedidosTeste.slice();
    let rotas = rotasTeste.slice();

    await request(app).delete('/pedidos/deleteAll');
    await request(app).delete('/rotas/deleteAll');

    for (const pedido of pedidos) {
      await request(app).post('/pedidos').send(pedido);
    }
    for (const rota of rotas) {
      await request(app).post('/rotas').send(rota);
    }
  });

  it('Verifica se a rota GET /pedidos retorna a lista de pedidos corretamente', async () => {
    const response = await request(app).get('/pedidos');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(3);
  });

  it('Verifica se a rota POST /pedidos cria um novo pedido corretamente', async () => {
    const novoPedido = {
      endereco: { latitude: -23.5505, longitude: -46.6333 },
      produto: 'Moletons',
      quantidade: 3
    };
    const response = await request(app).post('/pedidos').send(novoPedido);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(novoPedido));
  });

  it('Verifica se a rota GET /rotas retorna a lista de rotas corretamente', async () => {
    const response = await request(app).get('/rotas');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  it('Verifica se a rota POST /rotas cria uma nova rota corretamente', async () => {
    const novaRota = { latitude: -23.5510, longitude: -46.6339 };
    const response = await request(app).post('/rotas').send(novaRota);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(novaRota));
  });

  it('Verifica se a rota GET /melhor-rota/:id retorna a melhor rota de entrega corretamente', async () => {
    const rotaId = 1; 
    const response = await request(app).get(`/melhor-rota/${rotaId}`);
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
