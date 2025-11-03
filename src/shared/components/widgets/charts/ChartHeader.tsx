"use client"

import * as React from "react"
import { CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/shadcn/card"
import { TimeRangeSelect } from "./TimeRangeSelect"

export type ChartHeaderProps = {
  title?: string
  description?: string
  showTimeSelector?: boolean
  selectedIndex?: number | null
  onRangeChangeAction?: (index: string) => void
}

export function ChartHeader({
  title = "Chart",
  description,
  showTimeSelector = false,
  selectedIndex = null,
  onRangeChangeAction,
}: ChartHeaderProps) {
  return (
    <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
      <div className="grid flex-1 gap-1">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      {showTimeSelector && (
        <TimeRangeSelect selectedIndex={selectedIndex} onValueChangeAction={onRangeChangeAction} />
      )}
    </CardHeader>
  )
}
