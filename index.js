require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

let products = [];

// b) GET /products route
app.get('/products', (req, res) => {
  res.json(products);
});

// c) GET /products/:id route
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

// d) POST /products route
app.post('/products', (req, res) => {
  const { productName, cost, stockStatus } = req.body;
  
  if (!['in-stock', 'low-stock', 'out-of-stock'].includes(stockStatus)) {
    return res.status(400).send('Invalid stock status');
  }

  const newProduct = {
    id: Math.floor(Math.random() * 1000000),
    productName,
    cost,
    stockStatus,
    createdAt: new Date()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// e) PATCH /products/:id route (edit except stock status)
app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).send('Product not found');

  if (req.body.stockStatus) {
    return res.status(400).send('Cannot update stock status with this endpoint');
  }

  Object.assign(product, req.body);
  res.json(product);
});

// f) PATCH /products/:id/:status route (edit only stock status)
app.patch('/products/:id/:status', (req, res) => {
  const { id, status } = req.params;
  
  if (!['in-stock', 'low-stock', 'out-of-stock'].includes(status)) {
    return res.status(400).send('Invalid stock status');
  }

  const product = products.find(p => p.id === parseInt(id));
  if (!product) return res.status(404).send('Product not found');

  product.stockStatus = status;
  res.json(product);
});

// g) DELETE /products/:id route
app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Product not found');

  products.splice(index, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


