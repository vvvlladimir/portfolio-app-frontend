import {TimeRange} from "@/shared/components/widgets/charts/TimeRangeSelect";
import {usePortfolio} from "@/shared/api/queries/usePortfolio";
import {useMemo} from "react";
import {getSortedArrayByField} from "@/shared/lib/filter";
import {AllocationChartPie} from "@/app/analytics/charts/AllocationChartPie";
import {useTickers} from "@/shared/api/queries/useTickers";
import {joinByKey} from "@/shared/lib/utils";
import chroma from "chroma-js";

export type AllocationProps = {
    timeRange: TimeRange,
}

export default function Allocation({timeRange} : AllocationProps) {
    const {weightsQuery} = usePortfolio()
    const {tickersQuery} = useTickers()

    const { sorted } = useMemo(() => {
        if (!weightsQuery || !tickersQuery || tickersQuery.length === 0) {
            return { sorted: [] }
        }

        const { tickers, rows } = weightsQuery

        if (!rows || rows.length === 0) {
            return { sorted: [] }
        }

        const tickersSet = new Set(tickers)

        const portfolioTickersMeta = tickersQuery.filter(t =>
            tickersSet.has(t.ticker)
        )

        const latestRow = rows[rows.length - 1]
        const { weights } = latestRow

        const weightsMap = new Map<string, number>()
        tickers.forEach((ticker, i) => {
            weightsMap.set(ticker, weights[i] ?? 0)
        })

        const tickersWeights = portfolioTickersMeta.map((t) => ({
            ...t,
            weight: weightsMap.get(t.ticker) ?? 0,
        }))

        const { sorted } = getSortedArrayByField(
            tickersWeights,
            "weight",
            "asc"
        )
        return { sorted }
    }, [tickersQuery, weightsQuery])
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