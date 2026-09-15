const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/participants  -> { bride: [...], groom: [...] }
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM participants ORDER BY party_side ASC, sort_order ASC, id ASC'
    );
    const bride = result.rows.filter((r) => r.party_side === 'bride');
    const groom = result.rows.filter((r) => r.party_side === 'groom');
    res.json({ bride, groom });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/participants  -> create a row for one side
router.post('/', async (req, res) => {
  try {
    const {
      party_side,
      relation,
      day1_estimated = 0,
      day1_confirmed = 0,
      day1_invited = false,
      day2_estimated = 0,
      day2_confirmed = 0,
      day2_invited = false,
      sort_order = 0,
    } = req.body;

    if (!['bride', 'groom'].includes(party_side)) {
      return res.status(400).json({ error: 'party_side must be "bride" or "groom"' });
    }

    const result = await pool.query(
      `INSERT INTO participants
        (party_side, relation, day1_estimated, day1_confirmed, day1_invited,
         day2_estimated, day2_confirmed, day2_invited, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        party_side,
        relation || '',
        day1_estimated,
        day1_confirmed,
        day1_invited,
        day2_estimated,
        day2_confirmed,
        day2_invited,
        sort_order,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/participants/:id  -> update any subset of fields (used for
// inline-editing a cell, e.g. { day2_invited: true })
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM participants WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Not found' });
    }
    const current = existing.rows[0];
    const merged = { ...current, ...req.body };

    const result = await pool.query(
      `UPDATE participants SET
        party_side = $1, relation = $2, day1_estimated = $3, day1_confirmed = $4,
        day1_invited = $5, day2_estimated = $6, day2_confirmed = $7, day2_invited = $8,
        sort_order = $9
       WHERE id = $10 RETURNING *`,
      [
        merged.party_side,
        merged.relation,
        merged.day1_estimated,
        merged.day1_confirmed,
        merged.day1_invited,
        merged.day2_estimated,
        merged.day2_confirmed,
        merged.day2_invited,
        merged.sort_order,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/participants/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM participants WHERE id = $1', [id]);
    res.json({ message: 'Row deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
