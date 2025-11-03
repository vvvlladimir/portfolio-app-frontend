# Unified Chart Components

A collection of reusable, customizable chart components built on **shadcn-ui** and **Recharts**. All components share a consistent, prop-driven API designed for ease of use and modification.

## Features

- ✅ **Unified API**: Consistent props across all chart types
- ✅ **Type-Safe**: Full TypeScript support with detailed type definitions
- ✅ **Customizable**: Easy to override colors, formatters, axis settings, tooltips
- ✅ **Theme Integration**: Built on shadcn-ui with proper theming support
- ✅ **Responsive**: Mobile-friendly with responsive sizing
- ✅ **Empty States**: Graceful handling of missing or empty data
- ✅ **Time Filtering**: Built-in time range selection (where applicable)

## Components

### CustomChartBar

A versatile bar chart supporting multiple bars, dual Y-axes, and negative values with custom colors.

```tsx
import { CustomChartBar } from "@/shared/components/widgets/charts"

<CustomChartBar
  chartData={data}
  chartConfig={{
    revenue: { 
      label: "Revenue", 
      color: "var(--color-profit)",
      side: "left" 
    },
    profit: { 
      label: "Profit", 
      color: "var(--color-profit-light)",
      negativeColor: "var(--color-loss)",
      side: "right" 
    },
  }}
  title="Financial Overview"
  description="Monthly performance"
  xKey="month"
  yTickFormatter={(v) => `$${v.toFixed(0)}k`}
/>
```

**Props:**
- `chartData`: Array of data objects
- `chartConfig`: Configuration for each bar (colors, labels, Y-axis side)
- `dataKey`: Single bar key (alternative to multiple bars via config)
- `xKey`: Key for X-axis values (default: "date")
- `labelKey`: Key for labels on bars
- `xTickFormatter`: Format X-axis tick labels
- `yTickFormatter`: Format Y-axis tick labels
- `barCategoryGap`: Gap between bar groups (default: "15%")
- `barGap`: Gap between bars in same group (default: 0)
- `showGrid`: Show grid lines (default: true)
- `showTooltip`: Show tooltip on hover (default: true)
- `showLegend`: Show legend (default: true)

### CustomChartLine

A flexible line chart with support for multiple lines and time range filtering.

```tsx
import { CustomChartLine } from "@/shared/components/widgets/charts"

<CustomChartLine
  chartData={data}
  chartConfig={{
    total_value: { label: "Total Value", color: "var(--color-profit)" },
    invested_value: { label: "Invested", color: "var(--color-loss)" },
  }}
  title="Portfolio Growth"
  description="Over time"
  timeSelector={true}
  defaultTimeRange={90}
  xTickFormatter={(value) => {
    const date = new Date(value as string)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }}
/>
```

**Props:**
- `chartData`: Array of data objects (required)
- `chartConfig`: Configuration for each line (colors, labels) (required)
- `xKey`: Key for X-axis values (default: "date")
- `lineType`: Line interpolation ("monotone" | "linear" | "natural" | "step", default: "monotone")
- `showDots`: Show dots on data points (default: false)
- `strokeWidth`: Line thickness (default: 2)
- `timeSelector`: Show time range selector (default: false)
- `defaultTimeRange`: Default time range in days (default: 0 = all)
- `xTickFormatter`: Format X-axis tick labels
- `yTickFormatter`: Format Y-axis tick labels
- `showGrid`: Show grid lines (default: true)
- `showTooltip`: Show tooltip on hover (default: true)
- `tooltipIndicator`: Tooltip style ("line" | "dot" | "dashed", default: "line")
- `showLegend`: Show legend (default: true)

### CustomChartArea

An area chart with gradient fills, stacking, and time range filtering.

```tsx
import { CustomChartArea } from "@/shared/components/widgets/charts"

<CustomChartArea
  chartData={data}
  chartConfig={{
    total_pnl_pct: { 
      label: "Total Return %", 
      color: "var(--color-profit)" 
    },
  }}
  title="Portfolio Performance"
  description="Total Return"
  gradient={true}
  timeSelector={true}
  defaultTimeRange={365}
/>
```

**Props:**
- `chartData`: Array of data objects (required)
- `chartConfig`: Configuration for each area (colors, labels) (required)
- `xKey`: Key for X-axis values (default: "date")
- `gradient`: Enable gradient fill (default: false)
- `areaType`: Area interpolation ("monotone" | "linear" | "natural" | "step", default: "natural")
- `fillOpacity`: Opacity of area fill (default: 0.3)
- `stacked`: Stack areas (default: true)
- `timeSelector`: Show time range selector (default: false)
- `defaultTimeRange`: Default time range in days (default: 0 = all)
- `xTickFormatter`: Format X-axis tick labels (default: date formatter)
- `yTickFormatter`: Format Y-axis tick labels
- `showGrid`: Show grid lines (default: true)
- `showTooltip`: Show tooltip on hover (default: true)
- `tooltipIndicator`: Tooltip style ("line" | "dot" | "dashed", default: "dot")
- `showLegend`: Show legend (default: true)

### CustomChartPie

A pie or donut chart for displaying distributions.

```tsx
import { CustomChartPie } from "@/shared/components/widgets/charts"

<CustomChartPie
  chartData={data}
  chartConfig={{
    chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
    safari: { label: "Safari", color: "hsl(var(--chart-2))" },
    firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  }}
  title="Browser Distribution"
  description="Market share"
  dataKey="visitors"
  nameKey="browser"
  showLabels={true}
  innerRadius={60} // For donut chart
/>
```

**Props:**
- `chartData`: Array of data objects
- `chartConfig`: Configuration for colors and labels
- `dataKey`: Key for segment values (default: "visitors")
- `nameKey`: Key for segment names (default: "browser")
- `showLabels`: Show labels on segments (default: true)
- `innerRadius`: Inner radius for donut chart (default: 0)
- `outerRadius`: Outer radius (default: 80)
- `showTooltip`: Show tooltip on hover (default: true)

## Common Props

All chart components share these common props:

- `title`: Chart title
- `description`: Chart description/subtitle
- `timeSelector`: Enable time range selector (for applicable charts)
- `className`: Custom class for chart container
- `cardClassName`: Custom class for card wrapper
- `contentClassName`: Custom class for card content

## Chart Configuration

The `chartConfig` object defines styling and metadata for chart elements:

```tsx
const chartConfig = {
  revenue: {
    label: "Revenue",           // Display label
    color: "hsl(var(--chart-1))", // Color (supports CSS variables)
    side: "left",                // Y-axis side (bar charts only)
    negativeColor: "hsl(var(--destructive))" // Color for negative values
  }
}
```

## Empty States

All charts automatically display a friendly empty state when `chartData` is empty or undefined:

```tsx
<CustomChartBar
  chartData={[]} // Empty array
  chartConfig={{}}
  title="No Data Chart"
/>
// Displays: "No data available"
```

## Time Range Filtering

Charts with `timeSelector={true}` include a dropdown to filter data by time range:

- 1W (7 days)
- 1M (30 days)
- 3M (90 days)
- 6M (180 days)
- 1Y (365 days)
- ALL (all data)

The filtering is handled automatically by the `useTimeRange` hook.

## Utilities

### Shared Functions

```tsx
import {
  getChartColor,
  defaultDateFormatter,
  defaultTooltipDateFormatter,
  parseNumericValue,
  DEFAULT_CHART_HEIGHT,
} from "@/shared/components/widgets/charts"

// Get color from config with fallback
const color = getChartColor("revenue", chartConfig, 0)

// Format date for X-axis
const formatted = defaultDateFormatter(dateValue)

// Parse numeric values safely
const num = parseNumericValue(value)
```

## TypeScript Support

Full type definitions are available:

```tsx
import type {
  BarChartProps,
  LineChartProps,
  AreaChartProps,
  PieChartProps,
} from "@/shared/components/widgets/charts"
```

## Customization Examples

### Custom Tooltip Formatter

```tsx
<CustomChartLine
  chartData={data}
  chartConfig={config}
  tooltipLabelFormatter={(value) => (
    <div>
      <strong>{new Date(value).toLocaleDateString()}</strong>
      <br />
      <small>Custom description</small>
    </div>
  )}
/>
```

### Custom Axis Formatters

```tsx
<CustomChartBar
  chartData={data}
  chartConfig={config}
  xTickFormatter={(v) => v.toString().slice(0, 3)} // Abbreviate
  yTickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} // Currency
/>
```

### Hiding Elements

```tsx
<CustomChartArea
  chartData={data}
  chartConfig={config}
  showGrid={false}
  showLegend={false}
  showTooltip={false}
/>
```

### Custom Styling

```tsx
<CustomChartLine
  chartData={data}
  chartConfig={config}
  cardClassName="shadow-lg border-2"
  contentClassName="p-8"
  className="h-[600px]" // Override height
/>
```

## Architecture

The chart system is built on a layered architecture:

1. **Base Components** (`shadcn-ui/chart.tsx`)
   - `ChartContainer`: Wrapper with theming
   - `ChartTooltip` / `ChartTooltipContent`: Tooltip rendering
   - `ChartLegend` / `ChartLegendContent`: Legend rendering

2. **Type System** (`chart-types.ts`)
   - Comprehensive TypeScript interfaces
   - Prop inheritance for consistency

3. **Utilities** (`chart-utils.ts`)
   - Shared helper functions
   - Default formatters
   - Color management

4. **Chart Components**
   - `CustomChartBar`, `CustomChartLine`, `CustomChartArea`, `CustomChartPie`
   - Built on Recharts primitives
   - Wrapped in Card with ChartHeader

5. **Supporting Components**
   - `ChartHeader`: Title, description, time selector
   - `ChartNoData`: Empty state display
   - `TimeRangeSelect`: Time range dropdown

## Best Practices

1. **Always provide chartConfig** for Line and Area charts (required)
2. **Use CSS variables** for colors to support theming
3. **Provide meaningful labels** in chartConfig
4. **Format axis labels** for readability (currencies, percentages, dates)
5. **Test with empty data** to ensure graceful degradation
6. **Use timeSelector** for time-series data
7. **Keep data keys consistent** across chartData and chartConfig

## Migration from Old Components

The refactored components maintain backward compatibility. No changes needed for existing usage, but you can now:

- Use new props like `showGrid`, `showLegend`, `lineType`, etc.
- Import from central index: `from "@/shared/components/widgets/charts"`
- Access type definitions for custom implementations
- Use shared utilities for consistency

## Contributing

When adding features or fixing bugs:

1. Update types in `chart-types.ts`
2. Add utilities to `chart-utils.ts` if reusable
3. Maintain consistent prop patterns across charts
4. Update this README with examples
5. Ensure TypeScript compilation and linting pass
