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
                setHighlight("bg-green-100 dark:bg-green-900")
            } else {
                setHighlight("bg-red-100 dark:bg-red-900")
            }

            // обновляем прошлое значение сразу
            prevValue.current = value

            // сбрасываем highlight через 500мс
            const timeout = setTimeout(() => setHighlight(""), 5000)
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
            className={`font-mono tabular-nums text-sm transition-colors duration-500 ${colorClass} ${
                highlight
            } ${className ?? ""}`}
        >
            <div>{formatData(value, currency)}</div>
            {computedPercent != null && (
                <div className="text-xs opacity-50">{computedPercent.toFixed(2)}%</div>
            )}
        </div>
    )
}