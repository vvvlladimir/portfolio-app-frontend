"use client"

import React, {useMemo, useState} from "react"
import {SiteHeader} from "@/shared/components/widgets/site-header"
import {Card} from "@/shared/components/ui/shadcn/card"
import {formatData} from "@/shared/lib/formatData"
import {ReturnBadge} from "@/shared/components/ui/ReturnBadge"
import {Button} from "@/shared/components/ui/shadcn/button"
import {StatCard} from "@/shared/components/ui/StatCard"
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {filterPortfolio, getSortedArrayByField} from "@/shared/lib/filter";
import {usePositions} from "@/shared/api/queries/usePositions";
import {AnimatedTabs} from "@/shared/components/ui/AnimatedTabs";
import Overview from "@/app/analytics/overview";
import {TIME_RANGES, TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import Allocation from "@/app/analytics/allocation";
import Performance from "@/app/analytics/performance";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TIME_RANGES[5])

  const {historyQuery} = usePortfolio()
  const {statsQuery} = usePositions()

  const currency = historyQuery?.currency ?? "USD"

  const { portfolioStats } = filterPortfolio(historyQuery?.history, timeRange.days)
  const { sorted, best, worst } = useMemo(() =>
      getSortedArrayByField(
          statsQuery,
          (s): number | undefined =>
              timeRange.label === "ALL"
                  ? s.total_pnl_pct
                  : s?.periods?.[timeRange.label]?.twr_pct,
          "desc"),
      [statsQuery, timeRange]
  )

  const tabs = [
    {
      value: "overview",
      label: "Overview",
      content: <Overview timeRange={timeRange} stats={sorted}/>,
    },
    {
      value: "allocation",
      label: "Allocation",
      content: <Allocation timeRange={timeRange}/>,
    },
    {
      value: "performance",
      label: "Performance",
      content: <Performance timeRange={timeRange}/>,
    },
    {
      value: "comparison",
      label: "Comparison",
    }
  ]
  return (
      <main>
        <SiteHeader headerTitle="Analytics">
          {/* Time Range Selector */}
          <Card className="flex flex-row gap-1 bg-muted p-1">
            {TIME_RANGES.map((range) => (
                <Button
                    key={range.label}
                    variant={timeRange.days === range.days ? "default" : "ghost"}
                    onClick={() => setTimeRange(range)}
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
                value={formatData(portfolioStats.totalInvested, currency)}
            />
            <StatCard
                label={`Total Withdrawn`}
                value={formatData(portfolioStats.totalWithdrawn, currency)}
            />
            <StatCard
                label={`Best Performer`}
                tooltip={<ReturnBadge value={best?.periods?.[timeRange.label]?.twr_pct || best?.total_pnl_pct || 0} />}
                value={best?.ticker || "N/A"}
            />
            <StatCard
                label={`Worst Performer`}
                tooltip={<ReturnBadge value={worst?.periods?.[timeRange.label]?.twr_pct || worst?.total_pnl_pct || 0} />}
                value={worst?.ticker || "N/A"}
            />
          </div>
          <AnimatedTabs tabs={tabs}/>
        </div>
      </main>
  )
}