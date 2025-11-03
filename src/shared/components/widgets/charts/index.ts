/**
 * Unified Chart Components
 * 
 * A collection of reusable, customizable chart components built on shadcn-ui and Recharts.
 * All components share a consistent API and design system.
 */

export { CustomChartBar } from "./custom-chart-bar"
export { CustomChartLine } from "./custom-chart-line"
export { CustomChartArea } from "./custom-chart-area"
export { CustomChartPie } from "./custom-chart-pie"
export { ChartHeader } from "./ChartHeader"
export { ChartNoData } from "./ChartNoData"
export { TimeRangeSelect, TIME_RANGES } from "./TimeRangeSelect"

export type { TimeRange } from "./TimeRangeSelect"
export type { ChartHeaderProps } from "./ChartHeader"
export type { ChartNoDataProps } from "./ChartNoData"

export type {
  BaseChartProps,
  AxisConfig,
  GridConfig,
  TooltipConfig,
  LegendConfig,
  CartesianChartProps,
  BarChartProps,
  LineChartProps,
  AreaChartProps,
  PieChartProps,
} from "./chart-types"

export {
  getBarKeys,
  getChartColor,
  defaultDateFormatter,
  defaultTooltipDateFormatter,
  parseNumericValue,
  DEFAULT_CHART_HEIGHT,
  NO_TIME_SELECTOR_PROPS,
} from "./chart-utils"
