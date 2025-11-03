"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/shared/components/ui/shadcn/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { cn } from "@/shared/lib/utils"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { ChartNoData } from "@/shared/components/widgets/charts/ChartNoData"
import { useTimeRange } from "@/shared/hooks/useTimeRange"
import { LineChartProps } from "@/shared/components/widgets/charts/chart-types"
import {
  getChartColor,
  defaultTooltipDateFormatter,
  DEFAULT_CHART_HEIGHT,
} from "@/shared/components/widgets/charts/chart-utils"

/**
 * Unified Line Chart Component
 * 
 * A customizable line chart built on shadcn-ui and Recharts.
 * Supports multiple lines, time range filtering, custom formatters,
 * and all standard chart features (tooltips, legends, grid).
 * 
 * @example
 * ```tsx
 * <CustomChartLine
 *   chartData={data}
 *   chartConfig={{
 *     revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
 *     expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
 *   }}
 *   title="Trend Analysis"
 *   timeSelector={true}
 * />
 * ```
 */
export function CustomChartLine<T = Record<string, unknown>>({
  chartData,
  chartConfig = {},
  title,
  description,
  timeSelector = false,
  className,
  cardClassName,
  contentClassName,
  defaultTimeRange = 0,
  xKey = "date",
  xTickFormatter,
  yTickFormatter,
  lineType = "monotone",
  showDots = false,
  strokeWidth = 2,
  showGrid = true,
  showVerticalGrid = false,
  showTooltip = true,
  tooltipIndicator = "line",
  tooltipLabelFormatter = defaultTooltipDateFormatter,
  showLegend = true,
  legendVerticalAlign = "bottom",
}: LineChartProps<T>) {
  const { filteredData, selectedIndex, handleRangeChange } = useTimeRange<T>(
    chartData || [],
    defaultTimeRange,
    xKey as keyof T
  )

  // Show empty state if no data
  if (!filteredData || filteredData.length === 0) {
    return (
      <Card className={cn("pt-0 py-2", cardClassName)}>
        <ChartHeader
          title={title}
          description={description}
          showTimeSelector={false}
          selectedIndex={null}
          onRangeChangeAction={() => {}}
        />
        <CardContent className={cn("px-4", contentClassName)}>
          <ChartNoData />
        </CardContent>
      </Card>
    )
  }

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
          className={cn(DEFAULT_CHART_HEIGHT, className)}
        >
          <LineChart data={filteredData}>
            {showGrid && (
              <CartesianGrid vertical={showVerticalGrid} />
            )}
            <XAxis
              dataKey={xKey as string}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v) =>
                xTickFormatter ? xTickFormatter(v) : String(v)
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={8}
              tickFormatter={(v) =>
                yTickFormatter ? yTickFormatter(Number(v)) : String(v)
              }
            />
            {showTooltip && (
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={tooltipLabelFormatter}
                    indicator={tooltipIndicator}
                  />
                }
              />
            )}

            {Object.entries(chartConfig).map(([key], index) => (
              <Line
                key={key}
                dataKey={key}
                type={lineType}
                stroke={getChartColor(key, chartConfig, index)}
                strokeWidth={strokeWidth}
                dot={showDots}
              />
            ))}

            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign={legendVerticalAlign}
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}