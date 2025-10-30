"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
} from "@/shared/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { cn } from "@/shared/lib/utils"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { useTimeRange } from "@/shared/hooks/useTimeRange"

interface ChartAreaInteractiveProps<T> {
    chartData: T[]
    chartConfig: ChartConfig
    title?: string
    description?: string
    gradient?: boolean
    timeSelector?: boolean
    className?: string
    cardClassName?: string
    contentClassName?: string
    defaultTimeRange?: number
}

export function CustomChartArea<T>({
    chartData,
    chartConfig,
    title = "Area Chart",
    description = "Showing dynamic data",
    gradient = false,
    timeSelector = false,
    className,
    cardClassName,
    contentClassName,
    defaultTimeRange = 0,
}: ChartAreaInteractiveProps<T>) {
    const { filteredData, selectedIndex, handleRangeChange } = useTimeRange<T>(
        chartData,
        defaultTimeRange,
        "date" as keyof T
    )

    return (
        <Card className={cn("pt-0 py-2", cardClassName)}>
            <ChartHeader
                title={title}
                description={description}
                showTimeSelector={timeSelector}
                selectedIndex={selectedIndex}
                onRangeChangeAction={handleRangeChange}
            />

            <CardContent className={cn("px-4", contentClassName)}>
                <ChartContainer
                    config={chartConfig}
                    className={cn(
                        "aspect-video h-[30vh] sm:h-[40vh] md:h-[50vh] w-full",
                        className
                    )}
                >
                    <AreaChart data={filteredData}>
                        <CartesianGrid vertical={false} />
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
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={8} />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value as string).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />

                        {gradient && (
                            <defs>
                                {Object.entries(chartConfig).map(([key, config]) => (
                                    <linearGradient
                                        key={key}
                                        id={`fill-${key}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={config.color}
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={config.color}
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                ))}
                            </defs>
                        )}

                        {Object.entries(chartConfig).map(([key, config]) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                stroke={config.color}
                                fillOpacity={0.3}
                                fill={gradient ? `url(#fill-${key})` : config.color}
                                stackId="a"
                            />
                        ))}

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
