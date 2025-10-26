import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { fetcher } from "@/shared/api/client"
import { API_CONFIG, QueryParams } from "@/config/api"
import { Position } from "@/shared/types/position"

type UsePositionsOptions = {
    get_last?: boolean
    params?: QueryParams
}

export function usePositions({ get_last, params }: UsePositionsOptions = {}) {
    const queryClient = useQueryClient()

    const positionsQuery = useQuery({
        queryKey: ["positions", { get_last: !!get_last, ...params }],
        queryFn: () =>
            fetcher<Position[]>(
                API_CONFIG.endpoints.positions.snapshot({ get_last, ...params })
            ),
        staleTime: 1000 * 60 * 5,
    })

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
        positions: positionsQuery.data ?? [],
        isLoading: positionsQuery.isLoading,
        isError: positionsQuery.isError,
        refetch: positionsQuery.refetch,
        refresh: refreshMutation.mutate,
        isRefreshing: refreshMutation.isPending,
    }
}