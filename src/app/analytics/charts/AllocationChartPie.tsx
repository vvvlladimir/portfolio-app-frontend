"use client"

import * as React from "react"
import { PieChart, Pie, Cell, LabelList } from "recharts"
import { Card, CardContent } from "@/shared/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { cn } from "@/shared/lib/utils"
import {getChartColors} from "@/shared/lib/colors";

interface AllocationChartPieProps<T> {
    chartData: T[]
    chartConfig?: ChartConfig
    dataKey?: keyof T
    nameKey?: keyof T
    className?: string
}


export function AllocationChartPie<T>({
                                                chartData,
                                                chartConfig = {},
                                                dataKey,
                                                nameKey,
                                                className,
                                            }: AllocationChartPieProps<T>) {
    const colors = React.useMemo(() => getChartColors(chartData?.length || 0), [chartData])

    return (
        <Card className="py-3">
            <ChartHeader
                title="Portfolio Allocation"
                description="Breakdown of portfolio by asset weight"
            />
            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className={cn(
                        "[&_.recharts-pie-label-text]:fill-foreground aspect-square h-[50vh] w-full",
                        className
                    )}
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    indicator="line"
                                    formatter={(value, name) => {
                                        const percent = (value as number * 100).toFixed(2)
                                        return `${name} — ${percent}%`
                                    }}
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey={dataKey as string}
                            nameKey={nameKey as string}
                            outerRadius={150}
                            innerRadius={60}
                            paddingAngle={0}
                            labelLine={false}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                            <LabelList
                                dataKey={dataKey as string}
                                position="outside"
                                formatter={(value: number) => `${((value * 100).toFixed(1))}%`}
                                stroke="none"
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}