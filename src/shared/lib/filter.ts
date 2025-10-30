import {PortfolioHistory} from "@/shared/types/portfolio"
import { sumField } from "@/shared/lib/utils"
import {StatsPosition} from "@/shared/types/position";

export function filterPortfolio(portfolio: PortfolioHistory[] | undefined, days: number) {
    if (!portfolio) {
        return {
            filteredHistory: [],
            portfolioStats: {
                totalReturn: 0,
                totalInvested: 0,
                totalWithdrawn: 0,
                changePercent: 0,
                firstValue: null,
                lastValue: null,
            },
        }
    }

    const cutoff = days > 0
        ? new Date(new Date().setDate(new Date().getDate() - days))
        : null

    const filteredHistory = cutoff
        ? portfolio.filter(h => new Date(h.date) >= cutoff)
        : portfolio

    if (!filteredHistory.length) {
        return {
            filteredHistory: [],
            portfolioStats: {
                totalReturn: 0,
                totalInvested: 0,
                totalWithdrawn: 0,
                changePercent: 0,
                firstValue: null,
                lastValue: null,
            },
        }
    }

    const first = filteredHistory[0]
    const last = filteredHistory[filteredHistory.length - 1]

    const totalReturn = last.total_pnl - first.total_pnl
    const totalInvested = sumField(filteredHistory, "gross_invested")
    const totalWithdrawn = sumField(filteredHistory, "gross_withdrawn")
    const changePercent = !days
        ? last.total_pnl_pct
        : ((last.total_pnl - first.total_pnl) / first.invested_value) * 100

    return {
        filteredHistory,
        portfolioStats: {
            totalReturn,
            totalInvested,
            totalWithdrawn,
            changePercent,
            firstValue: first,
            lastValue: last,
        },
    }
}


export type SortedTickersResult = {
    sorted: StatsPosition[]
    best: StatsPosition | null
    worst: StatsPosition | null
}

export function getSortedTickersByReturn(
    stats: StatsPosition[],
    timeRangeLabel: string
): SortedTickersResult {
    if (!stats?.length) return { sorted: [], best: null, worst: null }

    const normalized: StatsPosition[] = stats.map((s) => {
        const percent = timeRangeLabel === "ALL" ? s.total_pnl_pct : s.returns?.[timeRangeLabel]
        return { ...s, percentReturn: percent || undefined }
    })

    const valid = normalized.filter((s) => typeof s.percentReturn === "number")

    if (!valid.length) return { sorted: [], best: null, worst: null }

    const sorted = [...valid].sort(
        (a, b) => (b.percentReturn ?? 0) - (a.percentReturn ?? 0)
    )

    const best = sorted[0] ?? null
    const worst = sorted[sorted.length - 1] ?? null

    return { sorted, best, worst }
}


export function aggregateByPeriod<T extends { date: string }>(
    data: T[],
    period: "day" | "week" | "month"
): T[] {
    if (!data?.length) return []

    const sorted = [...data].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const result: Record<string, T[]> = {}

    for (const item of sorted) {
        const d = new Date(item.date)

        let key: string
        if (period === "day") {
            key = d.toISOString().split("T")[0]
        } else if (period === "week") {
            const weekStart = new Date(d)
            weekStart.setDate(d.getDate() - d.getDay())
            key = weekStart.toISOString().split("T")[0]
        } else {
            key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        }

        if (!result[key]) result[key] = []
        result[key].push(item)
    }

    return Object.entries(result).map(([key, items]) => {
        const last = items[items.length - 1]
        return {
            ...last,
            date: key,
        }
    })
}

export function getChanges<T>(data: T[], field: keyof T, label: string = "change") {
    if (!data?.length) return []

    return data.map((item, index) => {
        const prev = data[index - 1]

        if (!prev || prev[field] == null) {
            return { ...item, [label]: Number(item[field]) }
        }

        return {
            ...item,
            [label]: Number(item[field]) - Number(prev[field]),
        }
    })
}