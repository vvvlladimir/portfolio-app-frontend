import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    XAxis,
    YAxis,
} from "recharts"
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
import * as React from "react";

interface ChartBarProps<T> {
    chartData?: T[]
    chartConfig?: ChartConfig
    title?: string
    description?: string
    timeSelector?: boolean
    className?: string
    xKey?: keyof T | string           // X axis
    labelKey?: keyof T | string       // Text label
    xTickFormatter?: (value: unknown) => string
    yTickFormatter?: (value: number) => string
}

export function CustomChartBar<T>({
                                      chartData,
                                      chartConfig = {},
                                      title,
                                      description,
                                      timeSelector = false,
                                      className,
                                      xKey = "date",
                                      labelKey,
                                      xTickFormatter,
                                      yTickFormatter,
                                  }: ChartBarProps<T>) {

    const barKeys = Object.keys(chartConfig)

    return (
        <Card className={cn("pt-0 py-2", className)}>
            <ChartHeader
                title={title}
                description={description}
                showTimeSelector={timeSelector}
                selectedIndex={null}
                onRangeChangeAction={() => {}}
            />
            <CardContent className={cn("px-4")}>
                <ChartContainer
                    config={chartConfig}
                    className={cn("aspect-video h-[30vh] sm:h-[40vh] md:h-[50vh] w-full")}
                >
                    <BarChart accessibilityLayer data={chartData} barCategoryGap="15%"
                              barGap={0}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xKey as string}
                            tickMargin={8}
                            minTickGap={16}
                            tickFormatter={(v) =>
                                xTickFormatter ? xTickFormatter(v) : String(v)
                            }
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tickMargin={8}
                            tickFormatter={(v) =>
                                yTickFormatter ? yTickFormatter(Number(v)) : String(v)
                            }
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickMargin={8}

                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideIndicator />}
                        />

                        {barKeys.map((key, index) => {
                            const config = chartConfig[key] || {}
                            const barColor = config.color || `hsl(var(--chart-${index + 1}))`

                            return (
                                <Bar
                                    key={key}
                                    dataKey={key}
                                    fill={barColor}
                                    radius={[4, 4, 0, 0]}
                                    yAxisId={config.side || "left"}
                                >
                                    {labelKey && (
                                        <LabelList
                                            dataKey={labelKey as string}
                                            position="top"
                                            fillOpacity={1}
                                        />
                                    )}
                                    {chartData?.map((item, idx) => {
                                        const raw = (item as Record<string, unknown>)[key]
                                        const num =
                                            typeof raw === "number"
                                                ? raw
                                                : typeof raw === "string"
                                                    ? parseFloat(raw)
                                                    : Number(raw as number)
                                        return (
                                            <Cell
                                                key={`${key}-${idx}`}
                                                fill={
                                                    num >= 0
                                                        ? barColor
                                                        : config.negativeColor ||
                                                        "hsl(var(--destructive))"
                                                }
                                            />
                                        )
                                    })}
                                </Bar>
                            )
                        })}

                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}