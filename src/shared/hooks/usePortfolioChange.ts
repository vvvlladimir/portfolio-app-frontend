import { useMemo } from "react"
import { useTickerStore } from "@/shared/stores/useTickerStore"
import useSWR from "swr"
import { API_CONFIG } from "@/config/api"
import { fetcher } from "@/shared/lib/swrFetcher"
import { PortfolioWeights } from "@/shared/types/portfolio"

export function usePortfolioChange() {
    const { data: weights } = useSWR<PortfolioWeights[]>(API_CONFIG.endpoints.portfolio.weights(), fetcher)
    const liveData = useTickerStore((s) => s.liveData)

    return useMemo(() => {
        if (!weights?.length) {
            return { todayChangePercent: 0, coveredWeight: 0 }
        }

        let weightedSum = 0
        let coveredWeight = 0

        weights.forEach(({ ticker, weight }) => {
            const live = liveData[ticker]
            if (!live) return
            weightedSum += weight * live.changePercent
            coveredWeight += weight
        })

        if (coveredWeight === 0) {
            return { todayChangePercent: 0, coveredWeight: 0 }
        }

        const todayChangePercent = weightedSum / coveredWeight

        return { todayChangePercent, coveredWeight }
    }, [weights, liveData])
}