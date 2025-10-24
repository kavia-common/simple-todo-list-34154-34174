import React, { useState, useEffect } from 'react';
import './App.css';
import './index.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { fetchTodos, addTodo, deleteTodo } from './services/api';

// PUBLIC_INTERFACE
function App() {
  /** Main retro-themed Todo App component. */
  const [theme, setTheme] = useState('light');
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchTodos();
        if (mounted) setTodos(data);
      } catch (e) {
        setErr('Failed to load todos');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAdd = async (title) => {
    try {
      const created = await addTodo(title);
      setTodos((prev) => [created, ...prev]);
    } catch {
      setErr('Failed to add todo');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setErr('Failed to delete todo');
    }
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="retro-header">
        <div className="retro-title">
          <span className="pixel">▮</span> Retro Todo
        </div>
        <button
          className="retro-btn ghost"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="retro-container">
        <TodoInput onAdd={handleAdd} />

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <TodoList items={todos} onDelete={handleDelete} />
        )}

        {err ? <p className="error-text">{err}</p> : null}
      </main>

      <footer className="retro-footer">
        <small>Built with a retro vibe • SQLite persistence</small>
      </footer>
    </div>
  );
}

export default App;
