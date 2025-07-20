import * as React from "react"
import { Card, CardContent } from "./Card"
import { Checkbox } from "./Checkbox"
import { Button } from "./Button"
import { Textarea } from "./Textarea"
import { Label } from "./Label"

export function TodoList({
  todos,
  editingId,
  editingTitle,
  loading,
  error,
  onToggle,
  onStartEdit,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  if (loading) {
    return <CardContent>Loading...</CardContent>
  }
  if (error) {
    return <CardContent className="text-red-600">{error}</CardContent>
  }
  if (todos.length === 0) {
    return <CardContent>No todos yet.</CardContent>
  }
  return (
    <ul className="w-full max-w-md">
      {todos.map((todo) => (
        <li key={todo.id} className="mb-3">
          <Card className={`flex items-center gap-3 p-4 ${todo.completed ? 'opacity-60' : ''}`}>
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id, todo.completed)}
              id={`todo-checkbox-${todo.id}`}
            />
            {editingId === todo.id ? (
              <div className="flex-1 flex items-center gap-2">
                <Textarea
                  value={editingTitle}
                  onChange={e => onEditTitleChange(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      onSaveEdit(todo);
                    }
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                  autoFocus
                  maxLength={80}
                  className="resize-none min-h-[40px]"
                />
                <Button onClick={() => onSaveEdit(todo)} disabled={!editingTitle.trim()} variant="default">✓</Button>
                <Button onClick={onCancelEdit} variant="outline">⏎</Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center gap-2">
                <Label htmlFor={`todo-checkbox-${todo.id}`} className="flex-1 cursor-pointer" onClick={() => onStartEdit(todo)}>
                  {todo.title}
                </Label>
                <Button onClick={() => onStartEdit(todo)} variant="outline">Edit</Button>
              </div>
            )}
            <Button onClick={() => onDelete(todo)} variant="destructive">✕</Button>
          </Card>
        </li>
      ))}
    </ul>
  )
} 