"use client"

import * as React from "react"
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/shared/components/ui/shadcn/chart"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { ChartNoData } from "@/shared/components/widgets/charts/ChartNoData"
import { cn } from "@/shared/lib/utils"
import { BarChartProps } from "@/shared/components/widgets/charts/chart-types"
import {
  getBarKeys,
  getChartColor,
  parseNumericValue,
  DEFAULT_CHART_HEIGHT,
} from "@/shared/components/widgets/charts/chart-utils"

/**
 * Unified Bar Chart Component
 * 
 * A customizable bar chart built on shadcn-ui and Recharts.
 * Supports multiple bars, dual Y-axes, negative values with custom colors,
 * and all standard chart features (tooltips, legends, formatters).
 * 
 * @example
 * ```tsx
 * <CustomChartBar
 *   chartData={data}
 *   chartConfig={{
 *     revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
 *     profit: { label: "Profit", color: "hsl(var(--chart-2))", side: "right" },
 *   }}
 *   title="Financial Overview"
 *   xKey="month"
 * />
 * ```
 */
export function CustomChartBar<T = Record<string, unknown>>({
  chartData,
  chartConfig = {},
  title,
  description,
  timeSelector = false,
  className,
  cardClassName,
  contentClassName,
  dataKey,
  xKey = "date",
  labelKey,
  xTickFormatter,
  yTickFormatter,
  barCategoryGap = "15%",
  barGap = 0,
  showGrid = true,
  showVerticalGrid = false,
  showTooltip = true,
  tooltipIndicator = "dot",
  hideTooltipLabel = true,
  showLegend = true,
  legendVerticalAlign = "bottom",
}: BarChartProps<T>) {
  const barKeys = getBarKeys(dataKey as string, chartConfig)

  // Show empty state if no data
  if (!chartData || chartData.length === 0) {
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
        selectedIndex={null}
        onRangeChangeAction={() => {}}
      />
      <CardContent className={cn("px-4", contentClassName)}>
        <ChartContainer
          config={chartConfig}
          className={cn(DEFAULT_CHART_HEIGHT, className)}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            barCategoryGap={barCategoryGap}
            barGap={barGap}
          >
            {showGrid && (
              <CartesianGrid vertical={showVerticalGrid} />
            )}
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
            {showTooltip && (
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideIndicator={hideTooltipLabel}
                    indicator={tooltipIndicator}
                  />
                }
              />
            )}

            {barKeys.map((key, index) => {
              const config = chartConfig[key] || {}
              const barColor = getChartColor(key, chartConfig, index)

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
                    const num = parseNumericValue(raw)
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

            {showLegend && (
              <ChartLegend
                content={<ChartLegendContent />}
                verticalAlign={legendVerticalAlign}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}