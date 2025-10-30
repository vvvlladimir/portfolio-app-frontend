import React from "react";
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {CustomChartLine} from "@/shared/components/widgets/charts/custom-chart-line";
import {aggregateByPeriod, getChanges} from "@/shared/lib/filter";
import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {CustomChartBar} from "@/shared/components/widgets/charts/custom-chart-bar";
import {StatsPosition} from "@/shared/types/position";

export type OverviewProps = {
    timeRange: TimeRange,
    sortedStats: StatsPosition[]
}

export default function Overview({timeRange, sortedStats} : OverviewProps) {
    const {historyQuery} = usePortfolio()
    const chartConfigLine = {
        total_value:
            {
                label: "Total Value",
                color: "var(--chart-2)"
            },
        invested_value:
            {
                label: "Invested Value",
                color: "var(--chart-1)"
            },
    }

    const chartConfigBar = {
        percentReturn: { label: "Return %", color: "var(--chart-1)" },
    }

    const chartConfigBarHistory = {
        change: { label: "Change", color: "var(--chart-1)" },
    }
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
                    timeRange?.days >= 31 || timeRange?.days == 0 ? 'week' : 'day'
                )}
                chartConfig={chartConfigLine}
                title="Portfolio Growth"
                description={`Portfolio for ${timeRange.label}`}
                defaultTimeRange={timeRange?.days}
            />

            <CustomChartBar
                chartData={sortedStats}
                chartConfig={chartConfigBar}
                title="Returns by Ticker"
                description={`Return for ${timeRange.label}`}
                xKey="ticker"
                dataKey="percentReturn"
                yTickFormatter={(v: number) => `${v.toFixed(1)}%`}
            />

            <CustomChartBar
                chartData={getChanges(aggregateByPeriod(
                    historyQuery?.history || [], 'month'
                ), "total_pnl")}
                chartConfig={chartConfigBarHistory}
                title="Monthly Returns"
                xKey="date"
                dataKey="change"
                className={"col-span-2"}
            />
        </div>
    )
}