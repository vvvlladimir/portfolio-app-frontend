"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
} from "@/shared/components/ui/shadcn/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/components/ui/shadcn/chart"
import { ChartHeader } from "@/shared/components/widgets/charts/ChartHeader"
import { ChartNoData } from "@/shared/components/widgets/charts/ChartNoData"
import { cn } from "@/shared/lib/utils"
import { PieChartProps } from "@/shared/components/widgets/charts/chart-types"

/**
 * Unified Pie Chart Component
 * 
 * A customizable pie/donut chart built on shadcn-ui and Recharts.
 * Supports labels, custom colors, inner radius for donut charts,
 * and all standard chart features (tooltips).
 * 
 * @example
 * ```tsx
 * <CustomChartPie
 *   chartData={data}
 *   chartConfig={{
 *     chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
 *     safari: { label: "Safari", color: "hsl(var(--chart-2))" },
 *   }}
 *   title="Browser Distribution"
 *   dataKey="visitors"
 *   nameKey="browser"
 *   showLabels={true}
 * />
 * ```
 */
export function CustomChartPie<T extends Record<string, unknown> = Record<string, unknown>>({
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
  showLabels = true,
  innerRadius = 0,
  outerRadius = 80,
  showTooltip = true,
  hideTooltipLabel = true,
}: PieChartProps<T>) {
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
          className={cn(
            "[&_.recharts-pie-label-text]:fill-foreground aspect-square h-[30vh] sm:h-[40vh] md:h-[50vh] w-full",
            className
          )}
        >
          <PieChart>
            {showTooltip && (
              <ChartTooltip content={<ChartTooltipContent hideLabel={hideTooltipLabel} />} />
            )}
            <Pie
              data={chartData as unknown as Record<string, unknown>[]}
              dataKey={dataKey as string}
              label={showLabels}
              nameKey={nameKey as string}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
