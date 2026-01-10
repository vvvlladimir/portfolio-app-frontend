import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {StatsPosition} from "@/shared/types/position";
import {PortfolioGrowthChart} from "@/app/analytics/charts/PortfolioGrowthChartLine";
import {aggregateByPeriod, getChanges} from "@/shared/lib/filter";
import {CustomChartBar} from "@/shared/components/widgets/charts/custom-chart-bar";
import React from "react";
import { PerformanceComparisonLine } from "./charts/PerformanceComparisonLine";
import { usePortfolio } from "@/shared/api/queries/usePortfolio";
import {usePositions} from "@/shared/api/queries/usePositions";

export type PerformanceProps = {
    timeRange: TimeRange,
}

export default function Performance({timeRange} : PerformanceProps) {
    const { weightsQuery } = usePortfolio({ get_last: false })
    console.log(weightsQuery)

    return (
        <div
            className="grid gap-4
            grid-cols-1
            lg:grid-cols-2
            items-stretch"
        >
            <PerformanceComparisonLine
                weights={weightsQuery}
                timeRange={timeRange}
                className={"col-span-2"}
            />
        </div>
    )
}