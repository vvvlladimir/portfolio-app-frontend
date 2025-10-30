import { useMutation, useQueryClient, useQueries } from "@tanstack/react-query"
import { fetcher } from "@/shared/api/client"
import { API_CONFIG } from "@/config/api"
import { Portfolio, PortfolioWeights } from "@/shared/types/portfolio"

export function usePortfolio() {
    const queryClient = useQueryClient()

    const results = useQueries({
        queries: [
            {
                queryKey: ["portfolio", "history"],
                queryFn: () => fetcher<Portfolio>(API_CONFIG.endpoints.portfolio.history()),
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ["portfolio", "weights"],
                queryFn: () => fetcher<PortfolioWeights[]>(API_CONFIG.endpoints.portfolio.weights()),
                staleTime: 1000 * 60 * 5,
            },
        ],
    })

    const [historyQuery, weightsQuery] = results

    const refreshMutation = useMutation({
        mutationFn: () =>
            fetcher<Portfolio>(API_CONFIG.endpoints.portfolio.refresh, { method: "POST" }),
        onSuccess: (data) => {
            queryClient.setQueryData(["portfolio", "history"], data)
            queryClient.invalidateQueries({ queryKey: ["portfolio", "weights"] })
        },
    })

    return {
        historyQuery: historyQuery.data,
        weightsQuery: weightsQuery.data,
        isLoading: historyQuery.isLoading || weightsQuery.isLoading,
        isError: historyQuery.isError || weightsQuery.isError,
        refresh: refreshMutation.mutate,
        isRefreshing: refreshMutation.isPending,
    }
}