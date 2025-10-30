"use client"

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
} from "@/shared/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { cn } from "@/shared/lib/utils"


interface ChartPieProps<T extends Record<string, unknown>> {
    chartData?: T[]
    chartConfig?: ChartConfig
    title?: string
    description?: string
    timeSelector?: boolean
    className?: string
    cardClassName?: string
    contentClassName?: string
    dataKey?: keyof T | string
    nameKey?: keyof T | string
}

export function CustomChartPie<T extends Record<string, unknown>>({
    chartData,
    chartConfig = {},
    title = "Pie Chart",
    description = "Showing distribution",
    timeSelector = false,
    className,
    cardClassName,
    contentClassName,
    dataKey = "visitors",
    nameKey = "browser",
}: ChartPieProps<T>) {
    return (
        <Card className={cn("pt-0 py-2", cardClassName)}>
            <ChartHeader
                title={title}
                description={description}
                showTimeSelector={timeSelector}
                selectedIndex={null}
                onRangeChangeAction={() => {}}
            />
            <CardContent className={cn("px-4", contentClassName)}>
                <ChartContainer
                    config={chartConfig}
                    className={cn("[&_.recharts-pie-label-text]:fill-foreground aspect-square h-[30vh] sm:h-[40vh] md:h-[50vh] w-full", className)}
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={chartData as unknown as Record<string, unknown>[] } dataKey={dataKey as string} label nameKey={nameKey as string} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
