const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const participantsRouter = require('./routes/participants');
const tabTasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Wedding Planner routes -------------------------------------------
app.use('/api/participants', participantsRouter);   // Main tab (bride/groom x day1/day2)
app.use('/api/tasks', tabTasksRouter);               // Photography / Flowers / Hall / Dressing

// --- Legacy generic "tasks" table, kept as-is in case you still use it -
app.get('/api/legacy-tasks', async (req, res) => {
  try {
    const allTasks = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(allTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
