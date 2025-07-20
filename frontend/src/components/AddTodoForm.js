import * as React from "react"
import { Input } from "./Input"
import { Button } from "./Button"
import { Label } from "./Label"

export function AddTodoForm({ title, onTitleChange, onSubmit, error }) {
  return (
    <form className="flex gap-3 items-end w-full max-w-md" onSubmit={onSubmit}>
      <div className="flex flex-col flex-1 gap-1">
        <Label htmlFor="todo-title">Add a new todo</Label>
        <Input
          id="todo-title"
          type="text"
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Add a new todo..."
          maxLength={80}
        />
        {error && <span className="text-red-600 text-xs mt-1">{error}</span>}
      </div>
      <Button type="submit">Add</Button>
    </form>
  )
} 