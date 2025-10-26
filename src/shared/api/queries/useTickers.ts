import {useMutation, useQueryClient, useQueries, useQuery} from "@tanstack/react-query"
import { fetcher } from "@/shared/api/client"
import {API_CONFIG, QueryParams} from "@/config/api"
import { Ticker } from "@/shared/types/ticker"

type UsePositionsOptions = {
    get_last?: boolean
    params?: QueryParams
}

export function useTickers({params }: UsePositionsOptions = {}) {
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ["tickers", params],
        queryFn: () =>
            fetcher<Ticker[]>(
                API_CONFIG.endpoints.tickers.get({...params})
            ),
        staleTime: 1000 * 60 * 5,
    })

    const refreshMutation = useMutation({
        mutationFn: () =>
            fetcher<Ticker>(API_CONFIG.endpoints.tickers.refresh, { method: "POST" }),
        onSuccess: (data) => {
            queryClient.setQueryData(["tickers"], data)
        },
    })

    return {
        tickers: result.data ?? [],
        isLoading: result.isLoading,
        isError: result.isError,
        refresh: refreshMutation.mutate,
        isRefreshing: refreshMutation.isPending,
    }
}