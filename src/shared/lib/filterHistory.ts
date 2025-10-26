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