import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
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

interface ChartBarProps<T> {
    chartData?: T[]
    chartConfig?: ChartConfig
    title?: string
    description?: string
    timeSelector?: boolean
    className?: string
    dataKey?: keyof T | string        // Y
    xKey?: keyof T | string           // X
    labelKey?: keyof T | string       // Text
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
      dataKey = "value",
      xKey = "date",
      labelKey = "category",
      xTickFormatter,
      yTickFormatter,
  }: ChartBarProps<T>) {
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
                    <BarChart accessibilityLayer data={chartData} >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={xKey as string}
                            tickMargin={8}
                            minTickGap={16}
                            tickFormatter={(v) => (xTickFormatter ? xTickFormatter(v) : String(v))}
                        />
                        <YAxis
                            tickMargin={8}
                            tickFormatter={(v) => (yTickFormatter ? yTickFormatter(Number(v)) : String(v))}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator/>} />
                        <Bar dataKey={dataKey as string}>
                            <LabelList position="top" dataKey={labelKey as string} fillOpacity={1} />
                            {chartData?.map((item, idx) => {
                                const raw = (item as Record<string, unknown>)[dataKey as string]
                                const num =
                                    typeof raw === "number"
                                        ? raw
                                        : typeof raw === "string"
                                            ? parseFloat(raw)
                                            : Number(raw as number)
                                return (
                                    <Cell
                                        key={idx}
                                        fill={num > 0 ? "var(--chart-2)" : "var(--chart-1)"}
                                    />
                                )
                            })}
                        </Bar>
                        <ChartLegend content={<ChartLegendContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
