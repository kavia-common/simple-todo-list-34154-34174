import React from 'react';

/**
 * Retro-styled list to show todos with delete buttons.
 */

// PUBLIC_INTERFACE
export default function TodoList({ items, onDelete }) {
  /** Renders a list of todos. */
  if (!items || items.length === 0) {
    return <p className="empty-state">No todos yet. Add your first one!</p>;
  }

  return (
    <ul className="retro-list">
      {items.map((t) => (
        <li key={t.id} className="retro-list-item">
          <span className="retro-list-text">{t.title}</span>
          <button
            className="retro-btn danger"
            onClick={() => onDelete(t.id)}
            aria-label={`Delete ${t.title}`}
            title="Delete"
          >
            ✖
          </button>
        </li>
      ))}
    </ul>
  );
}
