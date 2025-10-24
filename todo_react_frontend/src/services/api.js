/**
 * API client for the Todo endpoints.
 * Uses the CRA proxy to hit /api locally.
 */

// PUBLIC_INTERFACE
export async function fetchTodos() {
  /** Fetches all todos from the API. */
  const res = await fetch('/api/todos');
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

// PUBLIC_INTERFACE
export async function addTodo(title) {
  /** Adds a todo with the specified title. */
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to add todo');
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Deletes the todo with the specified id. */
  const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete todo');
  return true;
}
