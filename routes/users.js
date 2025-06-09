var express = require('express');
var router = express.Router();
var db=require('../db'); // Assuming db.js is in the parent directory


// GET all siswa
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM siswa');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST siswa baru
router.post('/', async (req, res) => {
  const { nama, umur } = req.body;
  try {
    const [result] = await db.query('INSERT INTO siswa (nama, umur) VALUES (?, ?)', [nama, umur]);
    res.status(201).json({ id: result.insertId, nama, umur });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET siswa by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM siswa WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE siswa
router.put('/:id', async (req, res) => {
  const { nama, umur } = req.body;
  try {
    await db.query('UPDATE siswa SET nama = ?, umur = ? WHERE id = ?', [nama, umur, req.params.id]);
    res.json({ message: 'Siswa diupdate' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE siswa
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    res.json({ message: 'Siswa dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
