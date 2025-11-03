/**
 * Example Usage of Unified Chart Components
 * 
 * This file demonstrates various ways to use the unified chart components.
 * Copy these examples into your pages or components as needed.
 */

import { 
  CustomChartBar,
  CustomChartLine, 
  CustomChartArea,
  CustomChartPie 
} from "@/shared/components/widgets/charts"

// Example 1: Simple Bar Chart
function ExampleBarChart() {
  const data = [
    { month: "Jan", revenue: 4000, expenses: 2400 },
    { month: "Feb", revenue: 3000, expenses: 1398 },
    { month: "Mar", revenue: 2000, expenses: 9800 },
    { month: "Apr", revenue: 2780, expenses: 3908 },
    { month: "May", revenue: 1890, expenses: 4800 },
    { month: "Jun", revenue: 2390, expenses: 3800 },
  ]

  return (
    <CustomChartBar
      chartData={data}
      chartConfig={{
        revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
        expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
      }}
      title="Monthly Financials"
      description="Revenue vs Expenses"
      xKey="month"
    />
  )
}

// Example 2: Line Chart with Time Range Selector
function ExampleLineChart() {
  const data = [
    { date: "2024-01-01", users: 100, sessions: 150 },
    { date: "2024-01-02", users: 120, sessions: 180 },
    { date: "2024-01-03", users: 110, sessions: 165 },
    // ... more data
  ]

  return (
    <CustomChartLine
      chartData={data}
      chartConfig={{
        users: { label: "Users", color: "hsl(var(--chart-1))" },
        sessions: { label: "Sessions", color: "hsl(var(--chart-2))" },
      }}
      title="User Activity"
      description="Daily metrics"
      timeSelector={true}
      defaultTimeRange={30}
      xTickFormatter={(value) => 
        new Date(value as string).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })
      }
    />
  )
}

// Example 3: Area Chart with Gradient
function ExampleAreaChart() {
  const data = [
    { date: "2024-01-01", value: 1000 },
    { date: "2024-01-02", value: 1200 },
    { date: "2024-01-03", value: 1100 },
    // ... more data
  ]

  return (
    <CustomChartArea
      chartData={data}
      chartConfig={{
        value: { label: "Portfolio Value", color: "hsl(var(--chart-1))" },
      }}
      title="Portfolio Growth"
      description="Over time"
      gradient={true}
      timeSelector={true}
    />
  )
}

// Example 4: Pie Chart
function ExamplePieChart() {
  const data = [
    { category: "Stocks", amount: 45000 },
    { category: "Bonds", amount: 30000 },
    { category: "Real Estate", amount: 15000 },
    { category: "Cash", amount: 10000 },
  ]

  return (
    <CustomChartPie
      chartData={data}
      chartConfig={{
        Stocks: { label: "Stocks", color: "hsl(var(--chart-1))" },
        Bonds: { label: "Bonds", color: "hsl(var(--chart-2))" },
        "Real Estate": { label: "Real Estate", color: "hsl(var(--chart-3))" },
        Cash: { label: "Cash", color: "hsl(var(--chart-4))" },
      }}
      title="Asset Allocation"
      description="Portfolio distribution"
      dataKey="amount"
      nameKey="category"
    />
  )
}

// Example 5: Bar Chart with Negative Values and Dual Axes
function ExampleAdvancedBarChart() {
  const data = [
    { ticker: "AAPL", return_pct: 15.5, return_value: 5000 },
    { ticker: "GOOGL", return_pct: -5.2, return_value: -1500 },
    { ticker: "MSFT", return_pct: 10.3, return_value: 3200 },
    { ticker: "TSLA", return_pct: -12.1, return_value: -4000 },
  ]

  return (
    <CustomChartBar
      chartData={data}
      chartConfig={{
        return_pct: {
          label: "Return %",
          color: "var(--color-profit)",
          negativeColor: "var(--color-loss)",
          side: "left",
        },
        return_value: {
          label: "Return Value",
          color: "var(--color-profit-light)",
          negativeColor: "var(--color-loss-light)",
          side: "right",
        },
      }}
      title="Stock Performance"
      description="Returns by ticker"
      xKey="ticker"
      yTickFormatter={(v: number) => `${v.toFixed(0)}%`}
    />
  )
}

// Example 6: Customized Line Chart
function ExampleCustomLineChart() {
  const data = [
    { date: "2024-01", profit: 5000 },
    { date: "2024-02", profit: 7000 },
    { date: "2024-03", profit: 6500 },
  ]

  return (
    <CustomChartLine
      chartData={data}
      chartConfig={{
        profit: { label: "Monthly Profit", color: "hsl(142, 76%, 36%)" },
      }}
      title="Profit Trend"
      lineType="natural"
      strokeWidth={3}
      showDots={true}
      showGrid={false}
      className="h-[400px]"
      cardClassName="shadow-lg"
    />
  )
}

// Example 7: Donut Chart
function ExampleDonutChart() {
  const data = [
    { browser: "Chrome", visitors: 275 },
    { browser: "Safari", visitors: 200 },
    { browser: "Firefox", visitors: 187 },
    { browser: "Edge", visitors: 173 },
  ]

  return (
    <CustomChartPie
      chartData={data}
      chartConfig={{
        Chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
        Safari: { label: "Safari", color: "hsl(var(--chart-2))" },
        Firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
        Edge: { label: "Edge", color: "hsl(var(--chart-4))" },
      }}
      title="Browser Usage"
      dataKey="visitors"
      nameKey="browser"
      innerRadius={60} // Makes it a donut
      outerRadius={80}
    />
  )
}

// Example 8: Stacked vs Non-Stacked Area Chart
function ExampleStackedAreaChart() {
  const data = [
    { date: "2024-01", productA: 100, productB: 150 },
    { date: "2024-02", productA: 120, productB: 180 },
    { date: "2024-03", productA: 140, productB: 200 },
  ]

  return (
    <CustomChartArea
      chartData={data}
      chartConfig={{
        productA: { label: "Product A", color: "hsl(var(--chart-1))" },
        productB: { label: "Product B", color: "hsl(var(--chart-2))" },
      }}
      title="Product Sales"
      stacked={true} // Set to false for non-stacked
      fillOpacity={0.5}
      areaType="monotone"
    />
  )
}

export {
  ExampleBarChart,
  ExampleLineChart,
  ExampleAreaChart,
  ExamplePieChart,
  ExampleAdvancedBarChart,
  ExampleCustomLineChart,
  ExampleDonutChart,
  ExampleStackedAreaChart,
}
