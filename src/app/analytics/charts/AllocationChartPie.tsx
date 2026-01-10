"use client"

import * as React from "react"
import { PieChart, Pie, Cell, LabelList } from "recharts"
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
    ChartTooltip,
    ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { cn } from "@/shared/lib/utils"
import { groupByField } from "@/shared/lib/filter"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/shadcn/select"
import chroma from "chroma-js";

interface AllocationChartPieProps<T> {
    chartData: T[]
    chartConfig?: ChartConfig
    dataKey?: keyof T | string
    nameKey?: keyof T
    className?: string
    colors?: string[]
}

export function AllocationChartPie<T>({
                                          chartData,
                                          chartConfig = {},
                                          dataKey = "value",
                                          nameKey,
                                          className,
                                          colors = chroma.brewer.Paired,
                                      }: AllocationChartPieProps<T>) {

    const [groupBy, setGroupBy] = React.useState<
        "exchange" | "asset_type" | "currency" | "none"
    >("none")

    const grouped = React.useMemo(() => {
        if (groupBy === "none") {
            return []
        }

        const groups = groupByField(chartData, `${groupBy}`)
        return Object.entries(groups).map(([key, items]) => ({
            name: key,
            value: items.reduce(
                (sum, item) => sum + Number(item[dataKey as keyof T] ?? 0),
                0
            ),
            items,
        }))
    }, [chartData, groupBy, dataKey])

    const innerData = React.useMemo(() => {
        if (groupBy === "none") {
            return chartData.map((item) => ({
                name: String(item[nameKey as keyof T] ?? "Unknown"),
                value: Number(item[dataKey as keyof T] ?? 0),
            }))
        }

        return grouped.flatMap((group) =>
            group.items.map((item) => ({
                group: group.name,
                name: String(item[nameKey as keyof T] ?? "Unknown"),
                value: Number(item[dataKey as keyof T] ?? 0),
            }))
        )
    }, [chartData, grouped, groupBy, nameKey, dataKey])

    const colorsScale = React.useMemo(
        () => chroma.scale(colors).mode("lch").gamma(0.8).colors(grouped.length + innerData?.length),
        [colors, grouped.length, innerData?.length]
    )

    return (
        <Card className="py-3">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-4 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle>Portfolio Allocation</CardTitle>
                    <CardDescription>
                        {groupBy === "none"
                            ? "Distribution of all tickers"
                            : "Breakdown of portfolio by asset weight"}
                    </CardDescription>
                </div>
                <Select
                    value={groupBy}
                    onValueChange={(v) =>
                        setGroupBy(v as "exchange" | "asset_type" | "currency" | "none")
                    }
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Group by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">All Tickers</SelectItem>
                        <SelectItem value="asset_type">Asset Type</SelectItem>
                        <SelectItem value="exchange">Exchange</SelectItem>
                        <SelectItem value="currency">Currency</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>

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

                        {groupBy !== "none" && (
                            <Pie
                                data={grouped}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={150}
                                innerRadius={125}
                                paddingAngle={2}
                                label={({ name, value }) =>
                                    `${name} ${(value * 100).toFixed(1)}%`
                                }
                            >
                                {grouped.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colorsScale[index]}
                                    />
                                ))}
                            </Pie>
                        )}

                        <Pie
                            data={innerData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={groupBy === "none" ? 150 : 120}
                            innerRadius={0}
                            paddingAngle={0}
                        >
                            {innerData.map((entry, index) => (
                                <Cell
                                    key={`cell-inner-${index}`}
                                    fill={colorsScale[index + (grouped?.length || 0)]}
                                />
                            ))}
                            {groupBy == "none" && (
                                <LabelList
                                    dataKey="name"
                                    position="outside"
                                    stroke="none"
                                />
                            )}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}