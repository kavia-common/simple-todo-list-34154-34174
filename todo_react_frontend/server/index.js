#!/usr/bin/env node
/**
 * Lightweight Express server that proxies Todo CRUD to the SQLite service.
 * It initializes the 'todos' table if missing and exposes:
 *  - GET    /api/todos
 *  - POST   /api/todos
 *  - DELETE /api/todos/:id
 *
 * This server is intended to run inside the frontend container and connect to the
 * SQLite database container via its exposed HTTP interface (port 5001).
 *
 * ENV:
 *  - DATABASE_SERVICE_URL: Base URL of the SQLite service, e.g. http://todo_sqlite_database:5001
 *    This must be provided via the container environment or a .env file for local dev.
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

// PUBLIC_INTERFACE
function getConfig() {
  /**
   * Returns configuration derived from environment.
   */
  const base = process.env.DATABASE_SERVICE_URL || 'http://localhost:5001';
  return {
    sqliteBaseUrl: base.replace(/\/+$/, ''), // trim trailing slash
    port: process.env.PORT || 3001,
  };
}

// Helper: basic "SQL-over-HTTP" adapter to the sqlite container.
// The sqlite container is expected to expose endpoints to execute SQL.
// Since we don't have its exact API, we implement a simple, generic protocol:
// - POST {base}/exec with JSON { sql: "SQL", params?: [] } => { rows?: [], changes?: number, lastID?: number, error?: string }
// Adjust these endpoints here if your sqlite service differs.
async function sqliteExec(sql, params = []) {
  const { sqliteBaseUrl } = getConfig();
  const url = `${sqliteBaseUrl}/exec`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SQLite service error (${res.status}): ${text}`);
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// Ensure table exists
async function ensureSchema() {
  const createSQL = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await sqliteExec(createSQL);
}

// PUBLIC_INTERFACE
function createServer() {
  /**
   * Creates and configures the Express app with todo routes.
   */
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // GET /api/todos
  app.get('/api/todos', async (_req, res) => {
    try {
      await ensureSchema();
      const { rows } = await sqliteExec('SELECT id, title, created_at FROM todos ORDER BY id DESC');
      res.json(rows || []);
    } catch (err) {
      console.error('GET /api/todos error:', err);
      res.status(500).json({ error: 'Failed to fetch todos' });
    }
  });

  // POST /api/todos
  app.post('/api/todos', async (req, res) => {
    try {
      const { title } = req.body || {};
      if (!title || !String(title).trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      await ensureSchema();
      const { lastID } = await sqliteExec('INSERT INTO todos (title) VALUES (?)', [String(title).trim()]);
      const { rows } = await sqliteExec('SELECT id, title, created_at FROM todos WHERE id = ?', [lastID]);
      res.status(201).json(rows && rows[0] ? rows[0] : { id: lastID, title });
    } catch (err) {
      console.error('POST /api/todos error:', err);
      res.status(500).json({ error: 'Failed to create todo' });
    }
  });

  // DELETE /api/todos/:id
  app.delete('/api/todos/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid id' });
      }
      await ensureSchema();
      await sqliteExec('DELETE FROM todos WHERE id = ?', [id]);
      res.status(204).send();
    } catch (err) {
      console.error('DELETE /api/todos/:id error:', err);
      res.status(500).json({ error: 'Failed to delete todo' });
    }
  });

  return app;
}

// Start server if executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const { port } = getConfig();
  const app = createServer();
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

export { createServer, getConfig };
