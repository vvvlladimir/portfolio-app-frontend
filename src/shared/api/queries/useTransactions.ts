import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetcher } from "@/shared/api/client"
import {API_CONFIG, QueryParams} from "@/config/api"
import { Transaction } from "@/shared/types/transaction"

type UseTransactionsOptions = {
    params?: QueryParams
}

export function useTransactions({ params }: UseTransactionsOptions = {}) {
    const queryClient = useQueryClient()

    const transactionsQuery = useQuery({
        queryKey: ["transactions"],
        queryFn: () =>
            fetcher<Transaction[]>(
                API_CONFIG.endpoints.transactions.get({...params})
            ),
        staleTime: 1000 * 60 * 5,
    })

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append("file", file)

            return fetcher<Transaction[]>(API_CONFIG.endpoints.transactions.upload(), {
                method: "POST",
                body: formData,
            })
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["transactions", params], data)
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
        },
    })

    return {
        transactions: transactionsQuery.data ?? [],
        isLoading: transactionsQuery.isLoading,
        isError: transactionsQuery.isError,
        refresh: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        upload: uploadMutation.mutateAsync,
        isUploading: uploadMutation.isPending,
    }
}