// usePortfolio.ts
"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "@/shared/api/client"
import { API_CONFIG, apiKeys, QueryParams } from "@/config/api"
import { Portfolio, PortfolioWeights } from "@/shared/types/portfolio"

type UsePortfolioOptions = {
    get_last?: boolean
    params?: QueryParams
}

export function usePortfolio({ get_last, params }: UsePortfolioOptions = {}) {
    const queryClient = useQueryClient()

    const historyQuery = useQuery({
        queryKey: apiKeys.portfolio.history(params),
        queryFn: () =>
            fetcher<Portfolio>(API_CONFIG.endpoints.portfolio.history(params)),
        staleTime: 1000 * 60 * 5,
    })

    const weightsQuery = useQuery({
        queryKey: apiKeys.portfolio.weights({ get_last, ...params }),
        queryFn: () =>
            fetcher<PortfolioWeights>(
                API_CONFIG.endpoints.portfolio.weights({ get_last, ...params })
            ),
        staleTime: 1000 * 60 * 5,
    })

    const refreshMutation = useMutation({
        mutationFn: () =>
            fetcher<void>(API_CONFIG.endpoints.portfolio.refresh, {
                method: "POST",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: apiKeys.portfolio.root })
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