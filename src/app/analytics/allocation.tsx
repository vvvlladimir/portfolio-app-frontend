import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {useMemo} from "react";
import {getSortedArrayByField} from "@/shared/lib/filter";
import {AllocationChartPie} from "@/app/analytics/charts/AllocationChartPie";

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
            <AllocationChartPie
                chartData={sorted}
                chartConfig={{
                    weight: { label: "Weight"},
                }}
                dataKey="weight"
                nameKey="ticker"
            />
        </div>

    )
}