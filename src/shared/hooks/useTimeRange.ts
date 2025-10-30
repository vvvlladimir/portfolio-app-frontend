"use client"

import { TIME_RANGES } from "../components/widgets/charts/TimeRangeSelect"
import { useCallback, useEffect, useMemo, useState } from "react"

/**
 * Generic hook to filter time-series data by a given time range.
 */
export function useTimeRange<T>(
    chartData: T[] = [],
    currentRange: number = 0,
    filterField: keyof T
) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [range, setRange] = useState<number>(currentRange)

  useEffect(() => {
    setRange(currentRange)
  }, [currentRange])

  useEffect(() => {
    if (Array.isArray(TIME_RANGES) && TIME_RANGES.length > 0) {
      const matchIndex = TIME_RANGES.findIndex((opt) => opt.days === range)
      setSelectedIndex(matchIndex >= 0 ? matchIndex : 0)
    } else {
      setSelectedIndex(0)
    }
  }, [range])

  const filteredData = useMemo(() => {
    if (!chartData?.length) return [] as T[]
    if (range === 0) return chartData

    const lastItem = chartData[chartData.length - 1]
    const referenceDate = new Date(String(lastItem[filterField]))
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - range)

    return chartData.filter(
        (item) => new Date(String(item[filterField])) >= startDate
    )
  }, [chartData, range, filterField])

  const handleRangeChange = useCallback((index: string) => {
    const idx = parseInt(index, 10)
    const option = TIME_RANGES?.[idx]
    if (option) {
      setSelectedIndex(idx)
      setRange(option.days ?? 0)
    }
  }, [])

  return {
    filteredData,
    currentRange: range,
    selectedIndex,
    handleRangeChange,
  }
}