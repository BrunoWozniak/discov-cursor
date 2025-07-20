import * as React from "react"
import { Progress } from "./Progress"

export function LoadingProgress({ value = 50 }) {
  return (
    <div className="w-full max-w-md my-4">
      <Progress value={value} />
    </div>
  )
} 