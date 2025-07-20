import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./Dialog"
import { Switch } from "./Switch"
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue } from "./Select"
import { Button } from "./Button"
import { Label } from "./Label"

export function SettingsDialog({
  open,
  onOpenChange,
  preference = "option1",
  onPreferenceChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your preferences</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="settings-preference">Sample Preference</Label>
            <Select value={preference} onValueChange={onPreferenceChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 