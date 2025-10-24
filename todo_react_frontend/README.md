# Todo React Frontend (Retro Theme)

This app provides a retro-themed Todo interface with persistence via a SQLite service.

Architecture:
- React SPA on port 3000
- Thin Express server on port 3001 (starts alongside the client)
- SQLite service on port 5001

API (served by the Express server):
- GET /api/todos -> list todos
- POST /api/todos -> { title } -> create todo
- DELETE /api/todos/:id -> delete by id

Environment:
- Create a .env in this folder from .env.example and set:
  - DATABASE_SERVICE_URL=http://todo_sqlite_database:5001 (container networking) OR
  - DATABASE_SERVICE_URL=http://localhost:5001 (local dev)

Run locally:
- npm install
- npm start
  - Runs client and server concurrently.
  - CRA dev server proxies /api calls to http://localhost:3001.

Troubleshooting:
- If you see \"react-scripts: not found\" during build, ensure dependencies were installed:
  - npm install
  - If needed, remove any stale node_modules and retry install.

Build:
- npm run build

Notes:
- The server initializes the `todos` table if it doesn't exist.
- Styling is intentionally retro: monospace fonts, pixel-ish accents, and high-contrast buttons.

