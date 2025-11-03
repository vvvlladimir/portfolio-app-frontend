"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
import { AreaChartProps } from "@/shared/components/widgets/charts/chart-types"
import {
  getChartColor,
  defaultDateFormatter,
  defaultTooltipDateFormatter,
  DEFAULT_CHART_HEIGHT,
} from "@/shared/components/widgets/charts/chart-utils"

/**
 * Unified Area Chart Component
 * 
 * A customizable area chart built on shadcn-ui and Recharts.
 * Supports multiple areas, gradient fills, stacking, time range filtering,
 * and all standard chart features (tooltips, legends, grid).
 * 
 * @example
 * ```tsx
 * <CustomChartArea
 *   chartData={data}
 *   chartConfig={{
 *     revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
 *     profit: { label: "Profit", color: "hsl(var(--chart-2))" },
 *   }}
 *   title="Performance Over Time"
 *   gradient={true}
 *   stacked={true}
 * />
 * ```
 */
export function CustomChartArea<T = Record<string, unknown>>({
  chartData,
  chartConfig = {},
  title = "Area Chart",
  description = "Showing dynamic data",
  gradient = false,
  timeSelector = false,
  className,
  cardClassName,
  contentClassName,
  defaultTimeRange = 0,
  xKey = "date",
  xTickFormatter = defaultDateFormatter,
  yTickFormatter,
  areaType = "natural",
  fillOpacity = 0.3,
  stacked = true,
  showGrid = true,
  showVerticalGrid = false,
  showTooltip = true,
  tooltipIndicator = "dot",
  tooltipLabelFormatter = defaultTooltipDateFormatter,
  showLegend = true,
  legendVerticalAlign = "bottom",
}: AreaChartProps<T>) {
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
          <AreaChart data={filteredData}>
            {showGrid && (
              <CartesianGrid vertical={showVerticalGrid} />
            )}
            <XAxis
              dataKey={xKey as string}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={xTickFormatter}
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

            {gradient && (
              <defs>
                {Object.entries(chartConfig).map(([key], index) => (
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
                      stopColor={getChartColor(key, chartConfig, index)}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={getChartColor(key, chartConfig, index)}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
            )}

            {Object.entries(chartConfig).map(([key], index) => (
              <Area
                key={key}
                dataKey={key}
                type={areaType}
                stroke={getChartColor(key, chartConfig, index)}
                fillOpacity={fillOpacity}
                fill={gradient ? `url(#fill-${key})` : getChartColor(key, chartConfig, index)}
                stackId={stacked ? "a" : undefined}
              />
            ))}

            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign={legendVerticalAlign}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
