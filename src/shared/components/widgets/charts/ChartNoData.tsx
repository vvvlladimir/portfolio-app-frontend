"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface ChartNoDataProps {
  message?: string
  className?: string
}

/**
 * Component to display when chart has no data
 */
export function ChartNoData({
  message = "No data available",
  className,
}: ChartNoDataProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-full min-h-[200px] text-muted-foreground",
        className
      )}
    >
      <p className="text-sm">{message}</p>
    </div>
  )
}
