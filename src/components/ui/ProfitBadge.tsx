"use client"

import React, { useEffect, useRef, useState } from "react"
import { formatData } from "@/lib/formatData"

interface ProfitBadgeProps {
    value: number
    percent?: number
    currency?: string
    invested?: number
    className?: string
}

export function ProfitBadge({ value, percent, currency, invested, className }: ProfitBadgeProps) {
    const [highlight, setHighlight] = useState<string>("")
    const prevValue = useRef<number>(value)

    useEffect(() => {
        if (value !== prevValue.current) {
            if (value > prevValue.current) {
                setHighlight("animate-highlightGreen")
            } else {
                setHighlight("animate-highlightRed")
            }

            prevValue.current = value

            const timeout = setTimeout(() => setHighlight(""), 500)
            return () => clearTimeout(timeout)
        }
    }, [value])

    const colorClass =
        value >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"

    const computedPercent =
        percent !== undefined
            ? percent
            : invested
                ? (value / invested) * 100
                : null

    return (
        <div
            className={`font-mono tabular-nums text-sm transition-colors inline-block ${colorClass} ${
                highlight
            } ${className}`}
        >
            <div>{formatData(value, currency)}</div>
            {computedPercent != null && (
                <div className="text-xs opacity-60">{computedPercent.toFixed(2)}%</div>
            )}
        </div>
    )
}