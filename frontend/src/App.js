// App.js - Main React component for Neumorphic Todos app
import React, { useEffect, useState, useRef } from 'react';
import './App.css';

// API base URL, configurable via environment variable
const API_BASE = process.env.REACT_APP_API_BASE || 'http://backend:4000';

function App() {
  // State hooks for todos, input, loading, error, dark mode, editing, and modal
  const [todos, setTodos] = useState([]); // List of todo items
  const [title, setTitle] = useState(''); // New todo input
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message
  const [darkMode, setDarkMode] = useState(() => {
    // Persist dark mode preference in localStorage
    return localStorage.getItem('darkMode') === 'true';
  });
  const [editingId, setEditingId] = useState(null); // ID of todo being edited
  const [editingTitle, setEditingTitle] = useState(''); // Title being edited
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Show/hide delete modal
  const [todoToDelete, setTodoToDelete] = useState(null); // Todo selected for deletion
  const textareaRef = useRef(null); // Ref for auto-resizing textarea

  // Effect: Apply dark/light mode to body and persist preference
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Fetch all todos from backend API
  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/todos`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch todos');
      }
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch todos');
    }
    setLoading(false);
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo via API
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (title.length > 80) {
      setError('Title cannot exceed 80 characters');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to add todo');
      }
      setTitle('');
      fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to add todo');
    }
  };

  // Delete a todo by ID via API
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete todo');
      }
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
    }
  };

  // Start editing a todo (show textarea)
  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  // Save edited todo title via API
  const saveEdit = async (todo) => {
    if (!editingTitle.trim()) {
      setError('Title cannot be empty');
      return;
    }
    if (editingTitle.length > 80) {
      setError('Title cannot exceed 80 characters');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update todo');
      }
      setEditingId(null);
      setEditingTitle('');
      fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  };

  // Toggle completed state of a todo via API
  const toggleTodo = async (id, completed) => {
    try {
      const res = await fetch(`${API_BASE}/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update todo');
      }
      fetchTodos();
    } catch (err) {
      setError(err.message || 'Failed to update todo');
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (todo) => {
    setTodoToDelete(todo);
    setShowDeleteModal(true);
  };

  // Confirm deletion in modal
  const confirmDelete = async () => {
    if (!todoToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/todos/${todoToDelete.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete todo');
      }
      setTodos(todos.filter((todo) => todo.id !== todoToDelete.id));
      setShowDeleteModal(false);
      setTodoToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete todo');
      setShowDeleteModal(false);
      setTodoToDelete(null);
    }
  };

  // Cancel deletion in modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  // Auto-resize textarea for editing
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  // Effect: Adjust textarea height when editing
  useEffect(() => {
    if (editingId && textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [editingId, editingTitle]);

  // Main render
  return (
    <div className={`app-container${darkMode ? ' dark' : ''}`}>
      {/* Top bar with dark mode toggle */}
      <div className="top-bar">
        <span className="toggle-text">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
        <button
          className={`neumorphic-toggle${darkMode ? ' toggled' : ''}`}
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
        >
          <div className="toggle-thumb" />
        </button>
      </div>
      <h1 className="neumorphic-title">Neumorphic Todos</h1>
      {/* Add todo form */}
      <form className="neumorphic-form" onSubmit={addTodo}>
        <input
          className="neumorphic-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          maxLength={80}
        />
        <button className="neumorphic-btn" type="submit">Add</button>
      </form>
      {/* Main content: loading, error, or todo list */}
      {loading ? (
        <div className="neumorphic-card">Loading...</div>
      ) : error ? (
        <div className="neumorphic-card error">{error}</div>
      ) : (
        <>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={`neumorphic-card todo-item${todo.completed ? ' completed' : ''}`}>  
                <div className="todo-row">
                  {/* Checkbox to toggle completed */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="todo-checkbox"
                    title="Toggle completed"
                  />
                  {editingId === todo.id ? (
                    <>
                      {/* Edit mode: textarea for title, save/cancel buttons */}
                      <textarea
                        ref={textareaRef}
                        className="edit-title-input"
                        value={editingTitle}
                        onChange={e => {
                          setEditingTitle(e.target.value);
                          adjustTextareaHeight();
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit(todo);
                          }
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        maxLength={80}
                      />
                      <div className="edit-actions">
                        {/* Save edit button, disabled if title is empty */}
                        <button className="icon-btn confirm" onClick={() => saveEdit(todo)} disabled={!editingTitle.trim()} title="Save">✓</button>
                        {/* Cancel edit button */}
                        <button className="icon-btn cancel" onClick={cancelEdit} title="Cancel">⏎</button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Display todo title, click to edit */}
                      <span className="todo-title-text" onClick={() => startEdit(todo)} style={{ cursor: 'pointer' }}>{todo.title}</span>
                      <div className="edit-actions" />
                    </>
                  )}
                  {/* Delete button (opens modal) */}
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDeleteClick(todo)}
                    title="Delete todo"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {/* Delete confirmation modal */}
          {showDeleteModal && (
            <div className="modal-overlay">
              <div className="modal neumorphic-card">
                <div style={{marginBottom: 16}}>Are you sure you want to delete this todo?</div>
                <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
                  <button className="icon-btn confirm" onClick={confirmDelete} title="Confirm delete">✓</button>
                  <button className="icon-btn cancel" onClick={cancelDelete} title="Cancel delete">⏎</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App; 