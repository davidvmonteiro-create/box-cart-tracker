const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const boxRoutes = require('./routes/boxes');
const cartRoutes = require('./routes/carts');
const corridorRoutes = require('./routes/corridors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/boxes', boxRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/corridors', corridorRoutes);

// Servir o frontend (pasta dist do build)
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  console.log(`Acede em: http://localhost:${PORT}`);
});
