"use client"

import React, {useMemo, useState} from "react"
import {SiteHeader} from "@/shared/components/widgets/site-header"
import {Card} from "@/shared/components/ui/shadcn/card"
import {API_CONFIG} from "@/config/api"
import {fetcher} from "@/shared/lib/swrFetcher"
import useSWR from "swr"
import {Portfolio} from "@/shared/types/portfolio"
import {formatData} from "@/shared/lib/formatData"
import {ReturnBadge} from "@/shared/components/ui/ReturnBadge"
import {usePortfolioChange} from "@/shared/hooks/usePortfolioChange"
import {Button} from "@/shared/components/ui/shadcn/button"
import {StatCard} from "@/shared/components/ui/StatCard"
import {sumField} from "@/shared/lib/utils"
import {Position} from "@/shared/types/position";

const TIME_RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: null },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("ALL")

  const { data: portfolio } = useSWR<Portfolio>(
      API_CONFIG.endpoints.portfolio.history(),
      fetcher
  )
  const { data: positions } = useSWR<Position>(
      API_CONFIG.endpoints.positions.snapshot(),
      fetcher
  )


  const { todayChangePercent } = usePortfolioChange()

  const lastValue =
      portfolio?.history && portfolio.history.length > 0
          ? portfolio.history[portfolio.history.length - 1]
          : null

  const filteredHistory = useMemo(() => {
    if (!portfolio?.history) return []

    if (timeRange === "ALL") return portfolio.history

    const selected = TIME_RANGES.find(r => r.label === timeRange)
    if (!selected || !selected.days) return portfolio.history

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - selected.days)

    return portfolio.history.filter(
        h => new Date(h.date) >= cutoff
    )
  }, [portfolio?.history, timeRange])


  const portfolioStats = useMemo(() => {
    if (!filteredHistory.length) {
      return {
        totalReturn: 0,
        totalInvested: 0,
        totalWithdrawn: 0,
        changePercent: 0,
        firstValue: null,
        lastValue: null,
      }
    }

    const first = filteredHistory[0]
    const last = filteredHistory[filteredHistory.length - 1]

    const totalReturn = last.total_pnl - first.total_pnl
    const totalInvested = sumField(filteredHistory, "gross_invested")
    const totalWithdrawn = sumField(filteredHistory, "gross_withdrawn")
    const changePercent =
        timeRange == "ALL" ?
            last.total_pnl_pct : ((last.total_pnl - first.total_pnl) / first.invested_value) * 100

    return {
      totalReturn,
      totalInvested,
      totalWithdrawn,
      changePercent,
      firstValue: first,
      lastValue: last,
    }
  }, [filteredHistory, timeRange])


  const currency = portfolio?.currency ?? "USD"

  return (
      <main>
        <SiteHeader headerTitle="Analytics">
          {/* Time Range Selector */}
          <Card className="flex flex-row gap-1 bg-muted p-1">
            {TIME_RANGES.map((range) => (
                <Button
                    key={range.label}
                    variant={timeRange === range.label ? "default" : "ghost"}
                    onClick={() => setTimeRange(range.label)}
                    className="text-xs px-2 sm:px-3 h-4"
                >
                  {range.label}
                </Button>
            ))}
          </Card>
        </SiteHeader>

        <div className="p-4 space-y-4">
          <div
              className="grid gap-4
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            items-stretch"
          >
            <StatCard
                label={`Total Return`}
                tooltip={<ReturnBadge value={portfolioStats.changePercent} />}
                value={formatData(portfolioStats.totalReturn, currency)}
            />
            <StatCard
                label={`Total Invested`}
                tooltip={""}
                value={formatData(portfolioStats.totalInvested, currency)}
            />
            <StatCard
                label={`Total Withdrawn`}
                value={formatData(portfolioStats.totalWithdrawn, currency)}
            />
          </div>
        </div>
      </main>
  )
}