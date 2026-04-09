const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool, sql } = require('../db');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Tentativa:', email);
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE Email = @email');

    const user = result.recordset[0];
    if (!user) {
      console.log('[LOGIN] Utilizador NÃO encontrado na DB');
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    console.log('[LOGIN] Utilizador encontrado:', user.Email, '| Hash length:', user.PasswordHash?.length);
    const valid = await bcrypt.compare(password, user.PasswordHash);
    console.log('[LOGIN] Password válida?', valid);
    if (!valid) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: user.Id, name: user.Name, email: user.Email, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.Id, name: user.Name, email: user.Email, role: user.Role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const pool = await getPool();

    await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('hash', sql.VarChar, hash)
      .input('role', sql.VarChar, role || 'operator')
      .query('INSERT INTO Users (Name, Email, PasswordHash, Role) VALUES (@name, @email, @hash, @role)');

    res.status(201).json({ message: 'Utilizador criado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
