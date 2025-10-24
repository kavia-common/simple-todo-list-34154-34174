# simple-todo-list-34154-34174

This project contains a minimal full-stack Todo app built with a retro-themed React frontend, a thin Express API (inside the frontend container), and a separate SQLite database service.

Components:
- todo_react_frontend (port 3000 for UI, 3001 for API): React SPA + thin Express server
- todo_sqlite_database (port 5001): SQLite service which executes SQL via HTTP

How it works:
- The React app (port 3000) uses CRA proxy to call the Express API on port 3001.
- The Express API connects to the SQLite service at DATABASE_SERVICE_URL (port 5001).
- On first access, the API initializes the `todos` table if it does not exist.
- Endpoints exposed by the API:
  - GET /api/todos
  - POST /api/todos
  - DELETE /api/todos/:id

Running locally (from todo_react_frontend):
1) Copy .env example and set DATABASE_SERVICE_URL
   cp .env.example .env
   # For local development if sqlite service is at http://localhost:5001:
   # DATABASE_SERVICE_URL=http://localhost:5001

2) Install dependencies
   npm install
   # If you encounter transient install errors, re-run `npm install`. Some CI environments require a second attempt.

3) Start both client and server
   npm start
   - React dev server on http://localhost:3000
   - Express API on http://localhost:3001

Retro Theme:
- Monospace fonts, pixel-like accents, high-contrast buttons
- Simple, nostalgic styling while remaining accessible

Persistence:
- Todos are stored in the SQLite database service and persist across reloads.

Notes for containerized environments:
- Set DATABASE_SERVICE_URL to the database container host and port, e.g.:
  DATABASE_SERVICE_URL=http://todo_sqlite_database:5001
- Ensure the SQLite service exposes an /exec endpoint that accepts:
  POST /exec { "sql": "...", "params": [] }
  and returns JSON with { rows?, changes?, lastID?, error? }.
  Adjust server/index.js if your SQLite service uses different endpoints.
