const express = require('express');
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/boxes
router.get('/', auth, async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Boxes ORDER BY ScannedAt DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/boxes
router.post('/', auth, async (req, res) => {
  try {
    const { code, description, cartId } = req.body;
    const pool = await getPool();
    const result = await pool.request()
      .input('code', sql.VarChar, code)
      .input('description', sql.VarChar, description)
      .input('cartId', sql.Int, cartId || null)
      .input('scannedBy', sql.VarChar, req.user.name)
      .query(`INSERT INTO Boxes (Code, Description, CartId, ScannedAt, ScannedBy)
              OUTPUT INSERTED.*
              VALUES (@code, @description, @cartId, GETDATE(), @scannedBy)`);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/boxes/:id/assign
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { cartId } = req.body;
    const pool = await getPool();
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('cartId', sql.Int, cartId)
      .query('UPDATE Boxes SET CartId = @cartId WHERE Id = @id');
    res.json({ message: 'Caixa atribuída ao carrinho' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
