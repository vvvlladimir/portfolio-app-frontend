import React, {useMemo} from "react";
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {CustomChartLine} from "@/shared/components/widgets/charts/custom-chart-line";
import {aggregateByPeriod, getChanges} from "@/shared/lib/filter";
import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {CustomChartBar} from "@/shared/components/widgets/charts/custom-chart-bar";
import {StatsPosition} from "@/shared/types/position";
import {joinByKey} from "@/shared/lib/utils";

export type OverviewProps = {
    timeRange: TimeRange,
    sortedStats: StatsPosition[]
}

export default function Overview({timeRange, sortedStats} : OverviewProps) {
    const {historyQuery, weightsQuery} = usePortfolio()

    const weightSortedStats = useMemo(() => {
        const joined = joinByKey(sortedStats, weightsQuery || [], "ticker")

        return joined.map((item) => {
            const weight = item.extra_info?.weight ?? 0
            const percentReturn = item.percentReturn ?? 0
            const investedValue = item.total_value - (item.returns[timeRange.label] || 0)

            return {
                ...item,
                weighted_pnl_pct: percentReturn * weight,
                weighted_pnl_value: (investedValue ?? 0) * (percentReturn / 100)
            }
        })
    }, [sortedStats, timeRange.label, weightsQuery])

    return (
        <div
            className="grid gap-4
            grid-cols-1
            lg:grid-cols-2
            items-stretch"
        >
            <CustomChartLine
                chartData={aggregateByPeriod(
                    historyQuery?.history || [],
                    timeRange?.days === 0
                        ? 'month'
                        : timeRange?.days >= 31
                            ? 'week'
                            : 'day'
                )}
                chartConfig={{
                    total_value: { label: "Total Value", color: "var(--color-profit)" },
                    invested_value: { label: "Invested Value", color: "var(--color-loss)" },
                }}
                title="Portfolio Growth"
                description={`Portfolio for ${timeRange.label}`}
                defaultTimeRange={timeRange?.days}
            />

            <CustomChartBar
                chartData={weightSortedStats}
                chartConfig={{
                    percentReturn: { label: "Return %", color: "var(--color-profit)", negativeColor: "var(--color-loss)", side: "left" },
                    weighted_pnl_value: { label: "Return Value", color: "var(--color-profit-light)", negativeColor: "var(--color-loss-light)", side: "right" },
                }}
                title="Returns by Ticker"
                description={`Return for ${timeRange.label}`}
                xKey="ticker"
                yTickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />

            <CustomChartBar
                chartData={getChanges(aggregateByPeriod(
                    historyQuery?.history || [], 'month'
                ), "total_pnl")}
                chartConfig={{
                    change: { label: "Change", color: "var(--color-profit)", negativeColor: "var(--color-loss)" },
                }}
                title="Monthly Returns"
                xKey="date"
                dataKey="change"
                className={"col-span-2"}
            />
        </div>
    )
}