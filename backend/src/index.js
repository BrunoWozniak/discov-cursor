require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 4000;

// Error handling for uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// PostgreSQL connection setup
let pool;
try {
  pool = process.env.DATABASE_URL
    ? new (require('pg').Pool)({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      })
    : new (require('pg').Pool)({
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'postgres',
        port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
      });
} catch (err) {
  console.error('Error creating Postgres pool:', err);
  process.exit(1);
}

// Handle CORS properly
const cors = require('cors');
const allowedOrigins = [
  "http://localhost:3000",
  "https://brunowozniak.github.io",
  "http://frontend-server-test:3000",
  "http://frontend-e2e-test:3000"
];

// In test environment, be more permissive with CORS
if (process.env.NODE_ENV === 'test') {
  app.use(cors({
    origin: true, // Allow all origins in test environment
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }));
} else {
  app.use(cors({
    origin: function(origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }));
}

app.options('*', cors());

// Create a new todo
app.post('/todos', async (req, res) => {
  const { title, completed = false } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *',
      [title, completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single todo by id
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a todo (mark as done/undone, change title)
app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  // Build dynamic query based on provided fields
  const fields = [];
  const values = [];
  let idx = 1;
  if (title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
  if (completed !== undefined) {
    fields.push(`completed = $${idx++}`);
    values.push(completed);
  }
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  values.push(id);
  const query = `UPDATE todos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo by id
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted', todo: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete all todos (for test/dev only)
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  app.delete('/todos', async (req, res) => {
    try {
      await pool.query('DELETE FROM todos');
      res.json({ message: 'All todos deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Todo API server running on port ${PORT}`);
  });
}

module.exports = app;