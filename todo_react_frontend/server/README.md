This folder contains the thin Express API that the React app uses for Todo CRUD.

Runtime expectations:
- DATABASE_SERVICE_URL must point to the SQLite service base URL (e.g., http://todo_sqlite_database:5001).
- The SQLite service is expected to implement a generic SQL-over-HTTP endpoint:
  - POST {DATABASE_SERVICE_URL}/exec
    Body: { "sql": "SQL STRING", "params": [] }
    Response: { "rows"?: any[], "changes"?: number, "lastID"?: number, "error"?: string }

If your SQLite service differs, adjust server/index.js (sqliteExec function) accordingly.
