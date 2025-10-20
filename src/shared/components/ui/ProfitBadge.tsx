"use client"

import React, { useEffect, useRef, useState } from "react"
import { formatData } from "@/shared/lib/formatData"
import { cn } from "@/shared/lib/utils"

interface ProfitBadgeProps {
    value: number
    percent?: number
    currency?: string
    invested?: number
    className?: string
}

export function ProfitBadge({ value, percent, currency, invested, className }: ProfitBadgeProps) {
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
            className={cn("font-mono tabular-nums text-sm transition-colors inline-block", {colorClass}, {className})}
        >
            <div>{formatData(value, currency)}</div>
            {computedPercent != null && (
                <div className="text-xs opacity-60">{computedPercent.toFixed(2)}%</div>
            )}
        </div>
    )
}