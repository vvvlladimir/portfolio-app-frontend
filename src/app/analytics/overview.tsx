import React, {useMemo} from "react";
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {CustomChartLine} from "@/shared/components/widgets/charts/custom-chart-line";
import {aggregateByPeriod, getChanges} from "@/shared/lib/filter";
import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {CustomChartBar} from "@/shared/components/widgets/charts/custom-chart-bar";
import {StatsPosition} from "@/shared/types/position";

export type OverviewProps = {
    timeRange: TimeRange,
    stats: StatsPosition[]
}

export default function Overview({timeRange, stats} : OverviewProps) {
    const {historyQuery} = usePortfolio()

    const chartDataStats = useMemo(() => {
        return stats.map((s) => ({
            ticker: s.ticker,
            return_pct:
                timeRange.label === "ALL"
                    ? s.total_pnl_pct
                    : s.periods?.[timeRange.label]?.twr_pct,
            return_value:
                timeRange.label === "ALL"
                    ? s.total_pnl
                    : s.periods?.[timeRange.label]?.pnl_abs,
        }))
    }, [stats, timeRange])



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
                xTickFormatter={(value) => {
                    const date = new Date(value as string)
                    return date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                    })
                }}
            />

            <CustomChartBar
                chartData={chartDataStats}
                chartConfig={{
                    return_pct: {
                        label: "Return %",
                        color: "var(--color-profit)",
                        negativeColor: "var(--color-loss)",
                        side: "left",
                    },
                    return_value: {
                        label: "Return Value",
                        color: "var(--color-profit-light)",
                        negativeColor: "var(--color-loss-light)",
                        side: "right",
                    },
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
                xTickFormatter={(value) => {
                    const date = new Date(value as string)
                    return date.toLocaleDateString("en-US", {
                        month: "short",
                    })
                }}
            />
        </div>
    )
}