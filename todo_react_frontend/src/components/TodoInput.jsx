import { useState } from 'react';

/**
 * Retro-styled input for adding todos.
 */

// PUBLIC_INTERFACE
export default function TodoInput({ onAdd }) {
  /** Input row to add a new todo. */
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue('');
  };

  return (
    <form onSubmit={submit} className="retro-input-row">
      <input
        aria-label="New todo"
        className="retro-input"
        type="text"
        placeholder="Type a task and press Enter..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="retro-btn" type="submit">Add</button>
    </form>
  );
}
