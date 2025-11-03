/**
 * Shared types and interfaces for unified chart components
 */

import { ChartConfig } from "@/shared/components/ui/shadcn/chart"
import * as React from "react"

/**
 * Base props shared by all chart types
 */
export interface BaseChartProps<T = Record<string, unknown>> {
  /** Chart data array */
  chartData?: T[]
  /** Chart configuration for styling and labels */
  chartConfig?: ChartConfig
  /** Chart title */
  title?: string
  /** Chart description */
  description?: string
  /** Enable time range selector */
  timeSelector?: boolean
  /** Custom class for chart container */
  className?: string
  /** Custom class for card wrapper */
  cardClassName?: string
  /** Custom class for card content */
  contentClassName?: string
}

/**
 * Axis configuration
 */
export interface AxisConfig<T = Record<string, unknown>> {
  /** Key for X-axis data */
  xKey?: keyof T | string
  /** Formatter for X-axis ticks */
  xTickFormatter?: (value: unknown) => string
  /** Formatter for Y-axis ticks */
  yTickFormatter?: (value: number) => string
  /** Hide X-axis */
  hideXAxis?: boolean
  /** Hide Y-axis */
  hideYAxis?: boolean
}

/**
 * Grid and visual configuration
 */
export interface GridConfig {
  /** Show vertical grid lines */
  showVerticalGrid?: boolean
  /** Show horizontal grid lines (defaults to true) */
  showHorizontalGrid?: boolean
  /** Show cartesian grid */
  showGrid?: boolean
}

/**
 * Tooltip configuration
 */
export interface TooltipConfig {
  /** Show tooltip */
  showTooltip?: boolean
  /** Tooltip indicator style */
  tooltipIndicator?: "line" | "dot" | "dashed"
  /** Hide tooltip label */
  hideTooltipLabel?: boolean
  /** Custom tooltip label formatter */
  tooltipLabelFormatter?: (value: unknown, payload?: unknown[]) => React.ReactNode
}

/**
 * Legend configuration
 */
export interface LegendConfig {
  /** Show legend */
  showLegend?: boolean
  /** Legend vertical alignment */
  legendVerticalAlign?: "top" | "bottom"
  /** Hide legend icons */
  hideLegendIcon?: boolean
}

/**
 * Extended props for cartesian charts (Bar, Line, Area)
 */
export interface CartesianChartProps<T = Record<string, unknown>>
  extends BaseChartProps<T>,
    AxisConfig<T>,
    GridConfig,
    TooltipConfig,
    LegendConfig {
  /** Default time range in days (0 = all) */
  defaultTimeRange?: number
}

/**
 * Props specific to Bar charts
 */
export interface BarChartProps<T = Record<string, unknown>>
  extends CartesianChartProps<T> {
  /** Single data key for bar (if only one bar type) */
  dataKey?: keyof T | string
  /** Key for bar labels */
  labelKey?: keyof T | string
  /** Gap between bar categories */
  barCategoryGap?: string | number
  /** Gap between bars in same category */
  barGap?: number
}

/**
 * Props specific to Line charts
 */
export interface LineChartProps<T = Record<string, unknown>>
  extends CartesianChartProps<T> {
  /** Required chart config for Line charts */
  chartConfig: ChartConfig
  /** Line type */
  lineType?: "monotone" | "linear" | "natural" | "step"
  /** Show dots on line */
  showDots?: boolean
  /** Line stroke width */
  strokeWidth?: number
}

/**
 * Props specific to Area charts
 */
export interface AreaChartProps<T = Record<string, unknown>>
  extends CartesianChartProps<T> {
  /** Required chart config for Area charts */
  chartConfig: ChartConfig
  /** Area type */
  areaType?: "monotone" | "linear" | "natural" | "step"
  /** Enable gradient fill */
  gradient?: boolean
  /** Fill opacity (0-1) */
  fillOpacity?: number
  /** Stack areas */
  stacked?: boolean
}

/**
 * Props specific to Pie charts
 */
export interface PieChartProps<T extends Record<string, unknown> = Record<string, unknown>>
  extends BaseChartProps<T>,
    TooltipConfig,
    LegendConfig {
  /** Key for pie segment values */
  dataKey?: keyof T | string
  /** Key for pie segment names/labels */
  nameKey?: keyof T | string
  /** Show labels on pie segments */
  showLabels?: boolean
  /** Inner radius for donut chart (percentage) */
  innerRadius?: number
  /** Outer radius (percentage) */
  outerRadius?: number
}
