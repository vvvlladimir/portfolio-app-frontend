"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/shadcn/select"

export const TIME_RANGES = [
    { label: "1W", days: 7 },
    { label: "1M", days: 30 },
    { label: "3M", days: 90 },
    { label: "6M", days: 180 },
    { label: "1Y", days: 365 },
    { label: "ALL", days: 0 }
]
export type TimeRange = (typeof TIME_RANGES)[number]

export type TimeRangeSelectProps = {
  selectedIndex: number | null
  onValueChangeAction?: (index: string) => void
}

export function TimeRangeSelect({ selectedIndex, onValueChangeAction }: TimeRangeSelectProps) {
  if (selectedIndex === null) return null

  return (
    <Select onValueChange={onValueChangeAction} value={String(selectedIndex)}>
      <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Select a value">
        <SelectValue placeholder="Select range">
          {TIME_RANGES[selectedIndex]?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        {TIME_RANGES.map((option, index) => (
          <SelectItem key={index} value={String(index)} className="rounded-lg">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
