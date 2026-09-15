const express = require('express');
const router = express.Router();
const pool = require('../db');

const VALID_TABS = ['photography', 'flowers', 'hall', 'dressing'];

function checkTab(req, res, next) {
  if (!VALID_TABS.includes(req.params.tabKey)) {
    return res.status(400).json({ error: `tab must be one of: ${VALID_TABS.join(', ')}` });
  }
  next();
}

// GET /api/tasks/:tabKey
router.get('/:tabKey', checkTab, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tab_tasks WHERE tab_key = $1 ORDER BY sort_order ASC, id ASC',
      [req.params.tabKey]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/tasks/:tabKey
router.post('/:tabKey', checkTab, async (req, res) => {
  try {
    const { title, notes = '', is_done = false, sort_order = 0 } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' });
    }
    const result = await pool.query(
      `INSERT INTO tab_tasks (tab_key, title, notes, is_done, sort_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.params.tabKey, title.trim(), notes, is_done, sort_order]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/tasks/:tabKey/:id
router.put('/:tabKey/:id', checkTab, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query(
      'SELECT * FROM tab_tasks WHERE id = $1 AND tab_key = $2',
      [id, req.params.tabKey]
    );
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    const current = existing.rows[0];
    const merged = { ...current, ...req.body };

    const result = await pool.query(
      `UPDATE tab_tasks SET title = $1, notes = $2, is_done = $3, sort_order = $4
       WHERE id = $5 AND tab_key = $6 RETURNING *`,
      [merged.title, merged.notes, merged.is_done, merged.sort_order, id, req.params.tabKey]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/tasks/:tabKey/:id
router.delete('/:tabKey/:id', checkTab, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tab_tasks WHERE id = $1 AND tab_key = $2', [
      id,
      req.params.tabKey,
    ]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
