const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let pedidos = [];
let rotas = [];
let proxIdPedido = 1;
let proxIdRota = 1;

app.post('/pedidos', (request, response) => {
  const { endereco, produto, quantidade } = request.body;
  if (!endereco || !produto || quantidade === undefined) {
    return response.status(400).json({ error: 'Endereço, produto e quantidade são obrigatórios.' });
  }
  const pedido = { id: proxIdPedido++, endereco, produto, quantidade };
  pedidos.push(pedido);
  response.status(201).json(pedido);
});

app.get('/pedidos', (request, response) => {
  response.status(200).json(pedidos);
});

app.post('/rotas', (request, response) => {
  const { latitude, longitude } = request.body;
  if (latitude === undefined || longitude === undefined) {
    return response.status(400).json({ error: 'Latitude e longitude são obrigatórios.' });
  }
  const rota = { id: proxIdRota++, latitude, longitude };
  rotas.push(rota);
  response.status(201).json(rota);
});

app.get('/rotas', (request, response) => {
  response.status(200).json(rotas);
});

app.get('/melhor-rota/:id', (request, response) => {
  const rotaId = parseInt(request.params.id, 10);
  const rota = rotas.find(r => r.id === rotaId);

  if (!rota) {
    return response.status(404).json({ error: 'Rota não encontrada.' });
  }

  const melhorRota = pedidos.map(pedido => ({
    endereco: pedido.endereco,
    produto: pedido.produto,
    quantidade: pedido.quantidade,
  }));

  response.status(200).json(melhorRota);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

module.exports = app;
