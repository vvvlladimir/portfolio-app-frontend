import {PortfolioHistory} from "@/shared/types/portfolio"
import { sumField } from "@/shared/lib/utils"

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

export type SortOrder = "asc" | "desc"

export type GenericSortedResult<T> = {
    sorted: T[]
    best: T | null
    worst: T | null
}

export function getSortedArrayByField<T>(
    array: T[],
    selector: keyof T | ((item: T) => number | string | null | undefined),
    order: SortOrder = "desc"
): GenericSortedResult<T> {
    if (!array?.length) return { sorted: [], best: null, worst: null }

    const getValue = (item: T) => {
        if (typeof selector === "function") return selector(item)
        return item[selector]
    }

    const valid = array
        .map((item) => ({ item, value: getValue(item) }))
        .filter(({ value }) => value !== undefined && value !== null)

    if (!valid.length) return { sorted: [], best: null, worst: null }

    const sorted = [...valid].sort((a, b) => {
        const av = a.value
        const bv = b.value

        if (typeof av === "number" && typeof bv === "number") {
            return order === "asc" ? av - bv : bv - av
        }

        if (typeof av === "string" && typeof bv === "string") {
            return order === "asc"
                ? av.localeCompare(bv)
                : bv.localeCompare(av)
        }

        return 0
    })

    const result = sorted.map(({ item }) => item)
    const best = result[0] ?? null
    const worst = result[result.length - 1] ?? null

    return { sorted: result, best, worst }
}