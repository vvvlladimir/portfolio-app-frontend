"use client"

import { SWRConfig } from "swr"
import { fetcher } from "@/lib/swrFetcher"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{ fetcher, refreshInterval: 30000 }}>
            {children}
        </SWRConfig>
    )
}