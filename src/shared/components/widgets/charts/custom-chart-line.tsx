"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

interface ChartLineProps<T> {
    chartData: T[]
    chartConfig: ChartConfig
    title?: string
    description?: string
    timeSelector?: boolean
    className?: string
    cardClassName?: string
    contentClassName?: string
    defaultTimeRange?: number,
    xTickFormatter?: (value: unknown) => string
    yTickFormatter?: (value: number) => string
}

export function CustomChartLine<T>({
    chartData,
    chartConfig,
    title,
    description,
    timeSelector = false,
    className,
    cardClassName,
    contentClassName,
    defaultTimeRange = 0,
    xTickFormatter,
    yTickFormatter,
}: ChartLineProps<T>) {
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
                    <LineChart data={filteredData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(v) =>
                                xTickFormatter ? xTickFormatter(v) : String(v)
                            }
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
                                    indicator="line"
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