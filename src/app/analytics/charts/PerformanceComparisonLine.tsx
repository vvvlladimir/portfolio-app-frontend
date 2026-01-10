"use client"

import * as React from "react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

import { Card, CardContent } from "@/shared/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { useTimeRange } from "@/shared/hooks/useTimeRange"
import { cn } from "@/shared/lib/utils"
import chroma from "chroma-js";
import { PortfolioWeights } from "@/shared/types/portfolio"
import {aggregateByPeriod} from "@/shared/lib/filter";

interface PerformanceComparisonLineProps {
    weights: PortfolioWeights
    timeRange: { days: number; label: string }
    colors?: string[]
    className?: string
}

export function PerformanceComparisonLine({
                                              weights,
                                              timeRange,
                                              colors = chroma.brewer.Paired,
                                              className
                                          }: PerformanceComparisonLineProps) {

    const sortedWeights = React.useMemo(() => {
        if (!weights) return null

        const lastRow = weights.rows.at(-1)
        if (!lastRow) return weights

        const pairs = weights.tickers.map((t, i) => ({
            ticker: t,
            index: i,
            weight: lastRow.weights[i] ?? 0
        }))

        pairs.sort((a, b) => b.weight - a.weight)

        const sortedTickers = pairs.map((p) => p.ticker)

        const sortedRows = weights.rows.map((row) => ({
            date: row.date,
            weights: pairs.map((p) => row.weights[p.index] ?? 0)
        }))

        return { tickers: sortedTickers, rows: sortedRows }
    }, [weights])

    const colorsScale = React.useMemo(
        () =>
            chroma.scale(colors).mode("lch").gamma(0.8).colors(
                sortedWeights?.tickers.length ?? 0
            ),
        [colors, sortedWeights]
    )

    const chartConfig: ChartConfig = React.useMemo(() => {
        if (!sortedWeights) return {}

        return sortedWeights.tickers.reduce((acc, t, i) => {
            acc[t] = {
                label: t,
                color: colorsScale[i],
            }
            return acc
        }, {} as ChartConfig)
    }, [sortedWeights, colorsScale])


    const chartData = React.useMemo(() => {
        if (!sortedWeights) return []
        return sortedWeights.rows.map((row) => {
            const obj: Record<string, number | string> = { date: row.date }
            sortedWeights.tickers.forEach((t, i) => (obj[t] = row.weights[i] ?? 0))
            return obj
        })
    }, [sortedWeights])

    function getPeriodForRange(days: number): "day" | "week" | "month" {
        if (days === 0) return "month"
        if (days <= 30) return "day"
        if (days <= 180) return "week"
        if (days <= 365) return "month"
        return "month"
    }

    const aggregatedData = React.useMemo(() => {
        if (!chartData.length) return []

        const period = getPeriodForRange(timeRange.days)
        return aggregateByPeriod(chartData, period)
    }, [chartData, timeRange])

    const { filteredData } = useTimeRange(
        aggregatedData,
        timeRange.days,
        "date"
    )

    return (
        <Card className={cn("pt-0 py-2", className)}>
            <ChartHeader
                title="Portfolio Allocation Over Time"
                description={`Weights stacked for ${timeRange.label}`}
            />

            <CardContent className="px-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-video h-[30vh] sm:h-[40vh] md:h-[50vh] w-full"
                >
                    <AreaChart
                        data={filteredData}
                        stackOffset="expand"
                        margin={{ left: 12, right: 12, top: 12 }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value: string) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />

                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(v) => `${Math.round(v * 100)}%`}
                        />

                        <ChartTooltip
                            cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.4 }}
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    labelFormatter={(v) => {
                                        const d = new Date(v)
                                        return d.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                />
                            }
                        />

                        {Object.entries(chartConfig).map(([ticker, cfg]) => (
                            <Area
                                key={ticker}
                                dataKey={ticker}
                                type="natural"
                                stackId="a"
                                stroke={cfg.color}
                                fill={cfg.color}
                                fillOpacity={0.4}
                            />
                        ))}

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}