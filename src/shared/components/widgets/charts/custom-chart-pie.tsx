"use client"

import * as React from "react"
import {Pie, PieChart, Cell, LabelList} from "recharts"

import {
    Card,
    CardContent,
} from "@/shared/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/shared/components/ui/shadcn/chart"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { cn } from "@/shared/lib/utils"
import chroma from "chroma-js"


interface ChartPieProps<T> {
    chartData: T[] | undefined
    chartConfig?: ChartConfig
    title?: string
    description?: string
    timeSelector?: boolean
    className?: string
    cardClassName?: string
    contentClassName?: string
    dataKey?: keyof T | string
    nameKey?: keyof T | string
    defaultTimeRange?: number
    showLegend?: boolean
    innerRadius?: number
    outerRadius?: number
    paddingAngle?: number
    showLabels?: boolean
    labelPosition?: "inside" | "outside"
    labelFormatter?: (value: undefined) => string
    showPercentage?: boolean
}

export function CustomChartPie<T>({
    chartData,
    chartConfig = {},
    title,
    description,
    timeSelector = false,
    className,
    cardClassName,
    contentClassName,
    dataKey = "value",
    nameKey = "name",
    showLegend = true,
    innerRadius = 0,
    outerRadius = 100,
    paddingAngle = 0,
    showLabels = false,
    labelPosition = "outside",
    labelFormatter,
    showPercentage = false,
}: ChartPieProps<T>) {

    const colors = React.useMemo(() => {
        if (!chartData?.length) return []
        return chroma
            .scale(chroma.brewer.Paired)
            .mode("lab")
            .colors(chartData.length)
    }, [chartData])

    const totalValue = React.useMemo(() => {
        if (!chartData?.length) return 0
        return chartData.reduce((sum, item) => {
            const value = item[dataKey as keyof T]
            return sum + (typeof value === 'number' ? value : 0)
        }, 0)
    }, [chartData, dataKey])

    function getColor(entry: T, index: number) {
        return colors[index % colors.length]
    }

    const renderLabel = (entry: T & Record<string, unknown>) => {
        const value = entry as unknown as number

        if (showPercentage && totalValue > 0) {
            const percentage = ((value / totalValue) * 100).toFixed(1)
            return `${percentage}%`
        }

        return value
    }

    return (
        <Card className={cn("pt-0 py-2", cardClassName)}>
            <ChartHeader
                title={title}
                description={description}
                showTimeSelector={timeSelector}
                selectedIndex={null}
            />
            <CardContent className={cn("px-4", contentClassName)}>
                <ChartContainer
                    config={chartConfig}
                    className={cn("[&_.recharts-pie-label-text]:fill-foreground aspect-square h-[30vh] sm:h-[40vh] md:h-[50vh] w-full", className)}
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent

                                    labelFormatter={(v) =>
                                        labelFormatter ? labelFormatter(v) : String(v)
                                    }
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey={dataKey as string}
                            nameKey={nameKey as string}
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            paddingAngle={paddingAngle}
                        >
                            {chartData?.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColor(entry, index)}
                                />
                            ))}
                            {showLabels && (
                                <LabelList
                                    dataKey={dataKey as string}
                                    position={labelPosition}
                                    formatter={renderLabel}
                                    stroke=""
                                />
                            )}
                        </Pie>
                        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
