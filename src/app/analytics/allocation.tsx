import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import { CustomChartPie } from "@/shared/components/widgets/charts/custom-chart-pie";
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {useMemo} from "react";
import {getSortedArrayByField} from "@/shared/lib/filter";

export type AllocationProps = {
    timeRange: TimeRange,
}

export default function Allocation({timeRange} : AllocationProps) {
    const {weightsQuery} = usePortfolio()

    const { sorted, best, worst } = useMemo(() =>
            getSortedArrayByField(
                weightsQuery,
                "weight",
                "asc"),
        [weightsQuery]
    )

    return (
        <div
            className="grid gap-4
            grid-cols-1
            lg:grid-cols-2
            items-stretch"
        >
            <CustomChartPie
                chartData={sorted}
                chartConfig={{
                    weight: { label: "Weight", color: "var(--color-loss)" },
                    ticker: { label: "Ticker", color: "var(--color-loss)" },
                }}
                dataKey="weight"
                nameKey="ticker"
                title="Portfolio Allocation"
                description={"Portfolio breakdown by assets"}
                showLegend={false}
                outerRadius={150}
                innerRadius={60}
                showLabels={true}
                showPercentage={true}
                labelPosition="outside"
            />
        </div>

    )
}