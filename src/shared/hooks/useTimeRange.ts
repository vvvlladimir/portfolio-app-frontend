"use client"

import * as React from "react"
import { TIME_RANGES } from "../components/widgets/charts/TimeRangeSelect"
import {useCallback, useEffect, useMemo, useState} from "react";

/**
 * Generic time range filtering hook for time-series chart data.
 * - T must contain a `date` field (ISO string or parseable by Date).
 */
export function useTimeRange<T extends { date: string }>(
  chartData: T[] | undefined,
  currentRange: number = 0
) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (Array.isArray(TIME_RANGES) && TIME_RANGES.length > 0) {
      const matchIndex = TIME_RANGES.findIndex((opt) => opt.days === currentRange)
      setSelectedIndex(matchIndex >= 0 ? matchIndex : 0)
    } else {
      setSelectedIndex(null)
    }
  }, [currentRange])

  const filteredData = useMemo(() => {
    if (!chartData?.length) return [] as T[]
    if (currentRange === 0) return chartData

    const referenceDate = new Date(chartData[chartData.length - 1].date)
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - currentRange)

    return chartData.filter((item) => new Date(item.date) >= startDate)
  }, [chartData, currentRange])

  const handleRangeChange = useCallback((index: string) => {
    const idx = parseInt(index, 10)
    const option = TIME_RANGES?.[idx]
    if (option) {
      setSelectedIndex(idx)
    }
  }, [])

  return {
    filteredData,
    currentRange,
    selectedIndex,
    handleRangeChange,
  }
}

