import { useMemo } from "react"
import { useTickerStore } from "@/shared/stores/useTickerStore"
import {usePortfolio} from "@/shared/api/queries/usePortfolio";

export function usePortfolioChange() {
    const { weights } = usePortfolio()
    const liveData = useTickerStore((s) => s.liveData)
    return useMemo(() => {
        if (!weights?.length) return { todayChangePercent: 0, coveredWeight: 0 }

        let todayChangePercent = 0
        let coveredWeight = 0

        for (const { ticker, weight } of weights) {
            const live = liveData[ticker]
            if (!live?.changePercent) continue

            todayChangePercent += weight * (live?.changePercent || 0)
            coveredWeight += weight
        }

        return { todayChangePercent, coveredWeight }
    }, [weights, liveData])
}