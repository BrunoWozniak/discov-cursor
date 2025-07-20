import React, { useState, useEffect } from "react";
import { Button } from "./components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/Card";
import { Checkbox } from "./components/Checkbox";
import { Input } from "./components/Input";
import { Label } from "./components/Label";
import { Switch } from "./components/Switch";
import { Textarea } from "./components/Textarea";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogTrigger } from "./components/AlertDialog";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [darkMode, setDarkMode] = useState(() =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [deleteTodo, setDeleteTodo] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/todos`);
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    if (!title.trim()) return;
    if (title.length > 140) {
      setError("Todo must be 140 characters or less.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() })
      });
      if (!res.ok) throw new Error("Failed to add todo");
      setTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  async function saveEdit(todo) {
    if (!editingTitle.trim()) return;
    if (editingTitle.length > 140) {
      setError("Todo must be 140 characters or less.");
      return;
    }
    setError("");
    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() })
      });
      if (!res.ok) throw new Error("Failed to update todo");
      setEditingId(null);
      setEditingTitle("");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(id, completed) {
    setError("");
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed })
      });
      if (!res.ok) throw new Error("Failed to update todo");
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(todo) {
    setError("");
    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete todo");
      setDeleteTodo(null);
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  }

  // Filter todos based on filter state
  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center p-8 gap-8">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">Todos</h1>
        <div className="flex items-center gap-2">
          <Switch id="theme-toggle" checked={!!darkMode} onCheckedChange={setDarkMode} />
          <Label htmlFor="theme-toggle">{darkMode ? "Dark" : "Light"} Mode</Label>
        </div>
      </div>
      {/* Filter Button Group */}
      <div className="w-full max-w-md flex justify-center gap-2 mb-2">
        <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
        <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>Active</Button>
        <Button variant={filter === "completed" ? "default" : "outline"} onClick={() => setFilter("completed")}>Completed</Button>
      </div>
      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle>Add a new todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTodo} className="flex gap-2 w-full">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Add a new todo..."
              maxLength={140}
            />
            <Button type="submit">Add</Button>
          </form>
          {error && <div className="text-destructive mt-2 text-sm">{error}</div>}
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your Todos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.length === 0 && <div className="text-muted-foreground">No todos yet.</div>}
              {filteredTodos.map(todo => (
                <div key={todo.id} className="flex items-center gap-4 break-words max-w-full">
                  {editingId === todo.id ? (
                    <div className="flex flex-col gap-2 w-full bg-muted/50 rounded-md p-3 border border-input shadow-xs">
                      <Textarea
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            saveEdit(todo);
                          }
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        maxLength={140}
                        className="w-full min-h-[48px] rounded-md px-3 py-2"
                      />
                      <div className="flex gap-2 self-start w-fit">
                        <Button onClick={() => saveEdit(todo)} disabled={!editingTitle.trim()} variant="default" aria-label="Save">Save</Button>
                        <Button onClick={cancelEdit} variant="outline" aria-label="Cancel">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Checkbox checked={todo.completed} onCheckedChange={() => handleToggle(todo.id, todo.completed)} />
                      <span
                        className={
                          "flex-1 break-words max-w-[320px] " +
                          (todo.completed ? "line-through text-muted-foreground" : "")
                        }
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                        onDoubleClick={() => startEdit(todo)}
                        title={todo.title}
                      >
                        {todo.title}
                      </span>
                      <Button onClick={() => startEdit(todo)} variant="outline" aria-label="Edit">Edit</Button>
                      <AlertDialog open={deleteTodo && deleteTodo.id === todo.id} onOpenChange={open => setDeleteTodo(open ? todo : null)}>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" aria-label="Delete">✕</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this todo?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button variant="outline" aria-label="Cancel">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button variant="destructive" onClick={() => handleDelete(todo)} aria-label="Delete">Delete</Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 