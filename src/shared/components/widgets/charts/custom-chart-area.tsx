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
import { cn } from "@/shared/lib/utils"
import {useEffect, useMemo, useState} from "react";

interface ChartDataItem {
    date: string
    [key: string]: number | string
}

interface TimeRangeOption {
    label: string
    days?: number | "all"
}

interface ChartAreaInteractiveProps<T extends { date: string }> {
    chartData: T[]
    chartConfig: ChartConfig
    title?: string
    description?: string
    gradient?: boolean
    className?: string
    timeRangeOptions?: TimeRangeOption[]
    defaultTimeRange?: number | "all"
}

export function CustomChartArea<T extends { date: string }>({
                                                                     chartData,
                                                                     chartConfig,
                                                                     title = "Area Chart",
                                                                     description = "Showing dynamic data",
                                                                     gradient = false,
                                                                     className,
                                                                     timeRangeOptions,
                                                                     defaultTimeRange = "all",
                                                                 }: ChartAreaInteractiveProps<T>) {
    const [currentRange, setCurrentRange] = React.useState<number | "all">(defaultTimeRange)

    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null)

    React.useEffect(() => {
        setCurrentRange(defaultTimeRange)

        if (timeRangeOptions && timeRangeOptions.length > 0) {
            const matchIndex = timeRangeOptions.findIndex(
                (opt) => opt.days === defaultTimeRange
            )
            setSelectedIndex(matchIndex >= 0 ? matchIndex : null)
        }
    }, [defaultTimeRange, timeRangeOptions])

    const filteredData = React.useMemo(() => {
        if (!chartData?.length) return []

        if (currentRange === "all") return chartData

        const referenceDate = new Date(chartData[chartData.length - 1].date)
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - (currentRange as number))

        return chartData.filter(item => new Date(item.date) >= startDate)
    }, [chartData, currentRange])

    const handleRangeChange = (index: string) => {
        const option = timeRangeOptions?.[parseInt(index)]
        setCurrentRange(option?.days ?? "all")
        setSelectedIndex(parseInt(index))
    }

    return (
        <Card className="pt-0 py-2">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>

                {timeRangeOptions && timeRangeOptions.length > 0 && (
                    <Select
                        onValueChange={handleRangeChange}
                        value={selectedIndex !== null ? String(selectedIndex) : undefined}
                    >
                        <SelectTrigger
                            className="w-[160px] rounded-lg sm:ml-auto sm:flex"
                            aria-label="Select a value"
                        >
                            <SelectValue
                                placeholder="Select range"
                            >
                                {selectedIndex !== null
                                    ? timeRangeOptions[selectedIndex]?.label
                                    : undefined}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {timeRangeOptions.map((option, index) => (
                                <SelectItem key={index} value={String(index)} className="rounded-lg">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </CardHeader>

            <CardContent className="px-4">
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
                                const date = new Date(value)
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
                                        new Date(value).toLocaleDateString("en-US", {
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