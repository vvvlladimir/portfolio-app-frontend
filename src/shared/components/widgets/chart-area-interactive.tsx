"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/shadcn/select"

interface ChartDataItem {
    date: string
    [key: string]: number | string
}

interface ChartAreaInteractiveProps<T extends { date: string }> {
    chartData: T[]
    chartConfig: ChartConfig
    title?: string
    description?: string
}

export function ChartAreaInteractive<T extends { date: string }>({
                                         chartData,
                                         chartConfig,
                                         title = "Area Chart",
                                         description = "Showing dynamic data",
                                     }: ChartAreaInteractiveProps<T>) {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = React.useMemo(() => {
        if (!chartData?.length) return []

        if (timeRange === "all") return chartData

        const referenceDate = new Date(chartData[chartData.length - 1].date)
        let daysToSubtract = 90
        if (timeRange === "30d") daysToSubtract = 30
        else if (timeRange === "7d") daysToSubtract = 7

        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return chartData.filter((item) => new Date(item.date) >= startDate)
    }, [chartData, timeRange])

    return (
        <Card className="pt-0 py-2">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 mon    ths" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="all" className="rounded-lg">All time</SelectItem>
                        <SelectItem value="90d" className="rounded-lg">Last 3 months</SelectItem>
                        <SelectItem value="30d" className="rounded-lg">Last 30 days</SelectItem>
                        <SelectItem value="7d" className="rounded-lg">Last 7 days</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

            <CardContent className="px-4">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-video h-[30vh] sm:h-[40vh] md:h-[50vh] w-full"
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
                            tickCount={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />

                        {Object.entries(chartConfig).map(([key, config]) => (
                            <Area
                                key={key}
                                dataKey={key}
                                type="natural"
                                stroke={config.color}
                                fillOpacity={0.3}
                                fill={config.color}
                                // stackId="a"
                            />
                        ))}

                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}