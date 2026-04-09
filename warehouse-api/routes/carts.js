const express = require('express');
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/carts
router.get('/', auth, async (req, res) => {
  try {
    const pool = await getPool();
    const carts = await pool.request().query('SELECT * FROM Carts ORDER BY CreatedAt DESC');
    
    // Incluir caixas de cada carrinho
    for (const cart of carts.recordset) {
      const boxes = await pool.request()
        .input('cartId', sql.Int, cart.Id)
        .query('SELECT * FROM Boxes WHERE CartId = @cartId');
      cart.boxes = boxes.recordset;
    }
    
    res.json(carts.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/carts
router.post('/', auth, async (req, res) => {
  try {
    const { code, corridorId } = req.body;
    const pool = await getPool();
    const result = await pool.request()
      .input('code', sql.VarChar, code)
      .input('corridorId', sql.Int, corridorId || null)
      .query(`INSERT INTO Carts (Code, CorridorId, CreatedAt)
              OUTPUT INSERTED.*
              VALUES (@code, @corridorId, GETDATE())`);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/carts/:id/assign
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { corridorId } = req.body;
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('corridorId', sql.Int, corridorId)
      .query('UPDATE Carts SET CorridorId = @corridorId WHERE Id = @id');
    res.json({ message: 'Carrinho atribuído ao corredor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
