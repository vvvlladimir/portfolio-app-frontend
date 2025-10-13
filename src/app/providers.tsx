"use client"

import { SWRConfig } from "swr"
import { fetcher } from "@/shared/lib/swrFetcher"

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