import * as React from "react"
import { Alert, AlertTitle, AlertDescription } from "./Alert"

export function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
} 