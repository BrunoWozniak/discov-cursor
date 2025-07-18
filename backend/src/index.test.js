const request = require('supertest');
const app = require('./index');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'postgres',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

beforeEach(async () => {
  await pool.query('DELETE FROM todos');
});
afterAll(async () => {
  await pool.end();
});

describe('Todos API', () => {
  describe('GET /todos', () => {
    it('should return an array (integration smoke test)', async () => {
      const res = await request(app).get('/todos');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
    it('should return empty array if no todos', async () => {
      const res = await request(app).get('/todos');
      expect(res.body).toEqual([]);
    });
    it('should return all created todos', async () => {
      await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2)', ['A', false]);
      await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2)', ['B', true]);
      const res = await request(app).get('/todos');
      expect(res.body.length).toBe(2);
      expect(res.body[0]).toHaveProperty('title');
    });
  });

  describe('POST /todos', () => {
    it('should create a todo with title', async () => {
      const res = await request(app).post('/todos').send({ title: 'Test' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Test');
      expect(res.body.completed).toBe(false);
    });
    it('should create a todo with title and completed', async () => {
      const res = await request(app).post('/todos').send({ title: 'Done', completed: true });
      expect(res.statusCode).toBe(201);
      expect(res.body.completed).toBe(true);
    });
    it('should fail with missing title', async () => {
      const res = await request(app).post('/todos').send({});
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /todos/:id', () => {
    it('should return a todo by id', async () => {
      const { rows } = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', ['FindMe', false]);
      const id = rows[0].id;
      const res = await request(app).get(`/todos/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('FindMe');
    });
    it('should return 404 if not found', async () => {
      const res = await request(app).get('/todos/99999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update title', async () => {
      const { rows } = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', ['Old', false]);
      const id = rows[0].id;
      const res = await request(app).patch(`/todos/${id}`).send({ title: 'New' });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('New');
    });
    it('should update completed', async () => {
      const { rows } = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', ['Old', false]);
      const id = rows[0].id;
      const res = await request(app).patch(`/todos/${id}`).send({ completed: true });
      expect(res.statusCode).toBe(200);
      expect(res.body.completed).toBe(true);
    });
    it('should update both fields', async () => {
      const { rows } = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', ['Old', false]);
      const id = rows[0].id;
      const res = await request(app).patch(`/todos/${id}`).send({ title: 'New', completed: true });
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('New');
      expect(res.body.completed).toBe(true);
    });
    it('should return 404 if not found', async () => {
      const res = await request(app).patch('/todos/99999').send({ title: 'X' });
      expect(res.statusCode).toBe(404);
    });
    it('should return 400 if no fields', async () => {
      const { rows } = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', ['Old', false]);
      const id = rows[0].id;
      const res = await request(app).patch(`/todos/${id}`).send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const { rows } = await pool.query('INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *', ['Del', false]);
      const id = rows[0].id;
      const res = await request(app).delete(`/todos/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Todo deleted');
    });
    it('should return 404 if not found', async () => {
      const res = await request(app).delete('/todos/99999');
      expect(res.statusCode).toBe(404);
    });
  });
}); 