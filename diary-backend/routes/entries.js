const express = require('express');
const router = express.Router();
const pool = require('../db');

// CREATE or UPDATE entry based on date
router.post('/', async (req, res) => {
  const { id, date, text } = req.body;

  if (!id || !date || !text) {
    return res.status(400).json({ error: 'Missing id, date, or text' });
  }

  try {
    // Check if an entry for the date already exists
    const [rows] = await pool.execute('SELECT id FROM entries WHERE date = ?', [date]);

    if (rows.length > 0) {
      // Entry exists, update the text
      await pool.execute('UPDATE entries SET text = ? WHERE date = ?', [text, date]);
      res.json({ message: 'Entry updated.' });
    } else {
      // Entry doesn't exist, insert a new one
      await pool.execute('INSERT INTO entries (id, date, text) VALUES (?, ?, ?)', [id, date, text]);
      res.json({ message: 'Entry created.' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET entry by date
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM entries WHERE date = ?', [date]);
    if (rows.length === 0) return res.status(404).json({ message: 'No entry found' });

    // Return the full entry (including id)
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE entry by date
router.delete('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM entries WHERE date = ?', [date]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No entry found to delete' });
    }
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
