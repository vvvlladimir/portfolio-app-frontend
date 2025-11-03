# Migration Guide

This guide helps you migrate from the old custom chart implementation to the new unified chart components.

## Good News: No Breaking Changes! 🎉

All existing code will continue to work without modification. The refactoring maintains backward compatibility while adding new optional features.

## What's Changed

### Before (Still Works)
```tsx
import {CustomChartBar} from "@/shared/components/widgets/charts/custom-chart-bar"

<CustomChartBar
  chartData={data}
  chartConfig={config}
  title="My Chart"
/>
```

### After (Recommended)
```tsx
// Option 1: Import from index (cleaner)
import {CustomChartBar} from "@/shared/components/widgets/charts"

<CustomChartBar
  chartData={data}
  chartConfig={config}
  title="My Chart"
/>

// Option 2: Use new features
import {CustomChartBar} from "@/shared/components/widgets/charts"

<CustomChartBar
  chartData={data}
  chartConfig={config}
  title="My Chart"
  showGrid={false}        // NEW: Hide grid
  showLegend={false}      // NEW: Hide legend
  barCategoryGap="20%"    // NEW: Customize gaps
/>
```

## New Optional Features

### 1. Grid Customization
```tsx
<CustomChartLine
  chartData={data}
  chartConfig={config}
  showGrid={false}           // Hide grid completely
  showVerticalGrid={true}    // Show vertical grid lines
/>
```

### 2. Legend Customization
```tsx
<CustomChartArea
  chartData={data}
  chartConfig={config}
  showLegend={false}              // Hide legend
  legendVerticalAlign="top"       // Position at top
/>
```

### 3. Tooltip Customization
```tsx
<CustomChartBar
  chartData={data}
  chartConfig={config}
  showTooltip={false}                    // Disable tooltip
  tooltipIndicator="dashed"              // Change indicator style
  hideTooltipLabel={true}                // Hide tooltip label
/>
```

### 4. Line/Area Customization
```tsx
<CustomChartLine
  chartData={data}
  chartConfig={config}
  lineType="natural"       // Change curve type
  showDots={true}          // Show data points
  strokeWidth={3}          // Thicker lines
/>

<CustomChartArea
  chartData={data}
  chartConfig={config}
  areaType="monotone"      // Change curve type
  fillOpacity={0.5}        // More opaque fill
  stacked={false}          // Disable stacking
/>
```

### 5. Pie Chart Enhancements
```tsx
<CustomChartPie
  chartData={data}
  chartConfig={config}
  innerRadius={60}         // Donut chart
  outerRadius={90}         // Larger radius
  showLabels={false}       // Hide labels
/>
```

## Migrating Custom Implementations

If you have custom code around charts, here are patterns to follow:

### Pattern 1: Custom Formatters
```tsx
// Before (still works)
<CustomChartBar
  xTickFormatter={(v) => String(v)}
  yTickFormatter={(v) => String(v)}
/>

// After (same, but now typed better)
<CustomChartBar
  xTickFormatter={(v) => String(v)}           // typed as (value: unknown) => string
  yTickFormatter={(v) => `$${v.toFixed(0)}`}  // typed as (value: number) => string
/>
```

### Pattern 2: Empty Data Handling
```tsx
// Before (you had to handle this yourself)
{data.length === 0 ? (
  <div>No data</div>
) : (
  <CustomChartBar chartData={data} chartConfig={config} />
)}

// After (handled automatically)
<CustomChartBar 
  chartData={data}  // Can be empty or undefined
  chartConfig={config} 
/>
// Automatically shows "No data available" if data is empty
```

### Pattern 3: Using Utilities
```tsx
// Before
const barKeys = dataKey ? [dataKey] : Object.keys(chartConfig)
const color = config.color || `hsl(var(--chart-${index + 1}))`

// After (use utilities)
import { getBarKeys, getChartColor } from "@/shared/components/widgets/charts"

const barKeys = getBarKeys(dataKey, chartConfig)
const color = getChartColor(key, chartConfig, index)
```

## Advanced: Type-Safe Custom Components

If you're building custom chart components, use the exported types:

```tsx
import type { BarChartProps } from "@/shared/components/widgets/charts"

// Your custom wrapper
function MyCustomChart<T>(props: BarChartProps<T> & { extraProp: string }) {
  return (
    <div>
      <p>{props.extraProp}</p>
      <CustomChartBar {...props} />
    </div>
  )
}
```

## Checklist for Migration

- [ ] **No action required** - Your existing code works as-is
- [ ] (Optional) Update imports to use central index file
- [ ] (Optional) Add new features like `showGrid`, `showLegend`
- [ ] (Optional) Remove manual empty state handling
- [ ] (Optional) Use exported utilities for consistency
- [ ] (Optional) Use exported types for custom components

## Example: Full Migration

### Before
```tsx
import {CustomChartBar} from "@/shared/components/widgets/charts/custom-chart-bar"

function MyDashboard() {
  const data = fetchData()
  
  if (data.length === 0) {
    return <div>No data</div>
  }
  
  return (
    <CustomChartBar
      chartData={data}
      chartConfig={{
        value: { label: "Value", color: "hsl(var(--chart-1))" }
      }}
      title="My Chart"
      xKey="date"
    />
  )
}
```

### After
```tsx
import {CustomChartBar} from "@/shared/components/widgets/charts"

function MyDashboard() {
  const data = fetchData()
  
  return (
    <CustomChartBar
      chartData={data}  // Empty state handled automatically
      chartConfig={{
        value: { label: "Value", color: "hsl(var(--chart-1))" }
      }}
      title="My Chart"
      xKey="date"
      showGrid={false}     // NEW: Cleaner look
      barCategoryGap="25%" // NEW: More spacing
    />
  )
}
```

## Questions?

Refer to the [README.md](./README.md) for complete documentation and examples.
