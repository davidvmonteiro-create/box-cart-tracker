const express = require('express');
const { getPool, sql } = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/corridors
router.get('/', auth, async (req, res) => {
  try {
    const pool = await getPool();
    const corridors = await pool.request().query('SELECT * FROM Corridors ORDER BY Name');

    for (const corridor of corridors.recordset) {
      const carts = await pool.request()
        .input('corridorId', sql.Int, corridor.Id)
        .query('SELECT * FROM Carts WHERE CorridorId = @corridorId');
      
      for (const cart of carts.recordset) {
        const boxes = await pool.request()
          .input('cartId', sql.Int, cart.Id)
          .query('SELECT * FROM Boxes WHERE CartId = @cartId');
        cart.boxes = boxes.recordset;
      }
      
      corridor.carts = carts.recordset;
    }

    res.json(corridors.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/corridors
router.post('/', auth, async (req, res) => {
  try {
    const { name, zone } = req.body;
    const pool = await getPool();
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('zone', sql.VarChar, zone)
      .query(`INSERT INTO Corridors (Name, Zone)
              OUTPUT INSERTED.*
              VALUES (@name, @zone)`);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
