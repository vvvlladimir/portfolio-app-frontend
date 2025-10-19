"use client"

import { SWRConfig } from "swr"
import { fetcher } from "@/shared/lib/swrFetcher"
import { useEffect, useMemo } from "react"
import useSWR from "swr"
import { Position } from "@/shared/types/position"
import { useTickerStore } from "@/shared/stores/useTickerStore"
import { API_CONFIG } from "@/config/api"


export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{
            fetcher,
            refreshInterval: 0,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }}>
            {children}
        </SWRConfig>
    )
}

export function TickerProvider({ children }: { children: React.ReactNode }) {
    const { data: positions } = useSWR<Position[]>(
        API_CONFIG.endpoints.positions.snapshot(),
        fetcher,
        { shouldRetryOnError: false }
    )

    const tickers = useMemo(() => {
        if (!positions) return []
        return Array.from(new Set(positions.map((p) => p.ticker)))
    }, [positions])

    // tickers = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NVDA", "BRK-B", "JPM", "V"] // for demo purposes


    const connect = useTickerStore((s) => s.connect)
    const disconnect = useTickerStore((s) => s.disconnect)

    useEffect(() => {
        if (tickers.length) connect(tickers, 5)
        return () => disconnect()
    }, [connect, disconnect, tickers])

    return <>{children}</>
}