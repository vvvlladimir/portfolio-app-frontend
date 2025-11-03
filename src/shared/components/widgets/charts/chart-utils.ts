/**
 * Shared utilities for chart components
 */

import { ChartConfig } from "@/shared/components/ui/shadcn/chart"

/**
 * Default chart height classes
 */
export const DEFAULT_CHART_HEIGHT = "aspect-video h-[30vh] sm:h-[40vh] md:h-[50vh] w-full"

/**
 * Get bar keys from config or dataKey
 */
export function getBarKeys(
  dataKey: string | undefined,
  chartConfig: ChartConfig
): string[] {
  if (dataKey) {
    return [dataKey]
  }
  return Object.keys(chartConfig)
}

/**
 * Get color for a chart key
 */
export function getChartColor(
  key: string,
  chartConfig: ChartConfig,
  index: number
): string {
  const config = chartConfig[key]
  return config?.color || `hsl(var(--chart-${index + 1}))`
}

/**
 * Default date formatter for X-axis
 */
export function defaultDateFormatter(value: unknown): string {
  const date = new Date(value as string)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

/**
 * Default tooltip date formatter
 */
export function defaultTooltipDateFormatter(value: unknown): string {
  return new Date(value as string).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

/**
 * Parse numeric value from data item
 */
export function parseNumericValue(value: unknown): number {
  if (typeof value === "number") return value
  if (typeof value === "string") return parseFloat(value)
  return Number(value)
}
