"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

interface PortfolioGrowthChartProps<T> {
    chartData: T[]
    chartConfig: ChartConfig
    timeRange: { days: number; label: string }
}

export function PortfolioGrowthChart<T>({
                                            chartData,
                                            chartConfig = {},
                                            timeRange,
                                        }: PortfolioGrowthChartProps<T>) {

    const { filteredData } = useTimeRange<T>(
        chartData,
        timeRange?.days,
        "date" as keyof T
    )

    return (
        <Card className="pt-0 py-2">
            <ChartHeader
                title="Portfolio Growth"
                description={`Portfolio for ${timeRange.label}`}
            />
            <CardContent className="px-4">
                <ChartContainer
                    config={chartConfig}
                    className={cn(
                        "aspect-video h-[30vh] sm:h-[40vh] md:h-[50vh] w-full"
                    )}
                >
                    <LineChart data={filteredData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value as string)
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
                            tickCount={6}
                        />

                        <ChartTooltip
                            cursor={{ strokeDasharray: "3 3", strokeOpacity: 0.4 }}
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    labelFormatter={(v) => {
                                        const date = new Date(v)
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                />
                            }
                        />

                        {Object.entries(chartConfig).map(([key, config]) => (
                            <Line
                                key={key}
                                dataKey={key}
                                type="monotone"
                                stroke={config.color}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}

                        <ChartLegend content={<ChartLegendContent />} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
