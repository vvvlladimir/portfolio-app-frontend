"use client"

import React, {useMemo, useState} from "react"
import {SiteHeader} from "@/shared/components/widgets/site-header"
import {Card} from "@/shared/components/ui/shadcn/card"
import {formatData} from "@/shared/lib/formatData"
import {ReturnBadge} from "@/shared/components/ui/ReturnBadge"
import {Button} from "@/shared/components/ui/shadcn/button"
import {StatCard} from "@/shared/components/ui/StatCard"
import {sumField} from "@/shared/lib/utils"
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {filterPortfolio} from "@/shared/lib/filterHistory";

const TIME_RANGES = [
  { label: "1W", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
  { label: "1Y", days: 365 },
  { label: "ALL", days: 0 }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState(0)

  const {historyQuery: portfolio} = usePortfolio()
  const currency = portfolio?.currency ?? "USD"

  const { portfolioStats } = filterPortfolio(portfolio?.history, timeRange)
  return (
      <main>
        <SiteHeader headerTitle="Analytics">
          {/* Time Range Selector */}
          <Card className="flex flex-row gap-1 bg-muted p-1">
            {TIME_RANGES.map((range) => (
                <Button
                    key={range.label}
                    variant={timeRange === range.days ? "default" : "ghost"}
                    onClick={() => setTimeRange(range.days)}
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