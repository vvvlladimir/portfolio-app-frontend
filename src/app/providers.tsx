"use client"

import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useTickerStore } from "@/shared/stores/useTickerStore"
import { usePositions } from "@/shared/api/queries/usePositions"
import { useEffect, useMemo } from "react"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60,
            refetchOnWindowFocus: false,
            retry: true,
        },
    },
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <TickerProvider>{children}</TickerProvider>
        </QueryClientProvider>
    )
}

function TickerProvider({ children }: { children: React.ReactNode }) {
    const { positions, isLoading } = usePositions({ get_last: true })

    const connect = useTickerStore((state) => state.connect)
    const disconnect = useTickerStore((state) => state.disconnect)

    const tickers = useMemo(() => {
        if (!positions.length) return []
        return [...new Set(positions.map((p) => p.ticker))].sort()
    }, [positions])

    useEffect(() => {
        if (isLoading) return
        if (!tickers.length) return

        connect(tickers, 5)
        return () => {
            disconnect()
        }
    }, [tickers, isLoading, connect, disconnect])

    return <>{children}</>
}