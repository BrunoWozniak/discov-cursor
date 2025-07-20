import * as React from "react"
import { Switch } from "./Switch"
import { Button } from "./Button"
import { Label } from "./Label"

export function TopBar({ darkMode, onToggleDarkMode, onOpenSettings }) {
  return (
    <div className="w-full flex justify-end items-center p-4 gap-4">
      <Button variant="outline" onClick={onOpenSettings}>Settings</Button>
    </div>
  )
} 