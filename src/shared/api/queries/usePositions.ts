import {useMutation, useQueryClient, useQuery, useQueries} from "@tanstack/react-query"
import { fetcher } from "@/shared/api/client"
import { API_CONFIG, QueryParams } from "@/config/api"
import {Position, StatsPosition} from "@/shared/types/position"

type UsePositionsOptions = {
    get_last?: boolean
    params?: QueryParams
}

export function usePositions({ get_last, params }: UsePositionsOptions = {}) {
    const queryClient = useQueryClient()

    const results = useQueries({
        queries: [
            {
                queryKey: ["positions", { get_last: !!get_last, ...params }],
                queryFn: () =>
                    fetcher<Position[]>(
                        API_CONFIG.endpoints.positions.snapshot({ get_last, ...params })
                    ),
                staleTime: 1000 * 60 * 5,
            },
            {
                queryKey: ["stats", {...params}],
                queryFn: () =>
                    fetcher<StatsPosition[]>(API_CONFIG.endpoints.positions.stats()),
                staleTime: 1000 * 60 * 5,
            },
        ],
    })

    const [positionsQuery, statsQuery] = results


    const refreshMutation = useMutation({
        mutationFn: () =>
            fetcher<Position[]>(
                API_CONFIG.endpoints.positions.refresh,
                { method: "POST" }
            ),
        onSuccess: (data) => {
            queryClient.setQueryData(
                ["positions", { get_last: !!get_last, ...params }],
                data
            )
        },
    })

    return {
        positionsQuery: positionsQuery.data ?? [],
        statsQuery: statsQuery.data ?? [],
        isLoading: positionsQuery.isLoading || statsQuery.isLoading,
        isError: positionsQuery.isError || statsQuery.isError,
        positionsRefetch: positionsQuery.refetch,
        statsRefetch: statsQuery.refetch,
        refresh: refreshMutation.mutate,
        isRefreshing: refreshMutation.isPending,
    }
}