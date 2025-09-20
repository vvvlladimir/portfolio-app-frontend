"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/Card"
import { PrimaryButton } from "@/components/ui/PrimaryButton"
import { TransactionsTable } from "@/app/transactions/TransactionsTable"
import { Transaction, Position } from "@/types/schemas"
import {Upload} from "lucide-react"
import { AnimatedTabs } from "@/components/ui/AnimatedTabs"
import {PositionsTable} from "@/app/transactions/PositionsTable";
import React, {useEffect} from "react";
import {useTickerStore} from "@/stores/useTickerStore"


export default function TransactionsPage() {
    const { data: transactions, error: txError, isLoading: txLoading } = useSWR<Transaction[]>(
        "http://localhost:8000/portfolio/transactions"
    )

    const { data: positions, error: posError, isLoading: posLoading } = useSWR<Position[]>(
        "http://localhost:8000/portfolio/last-positions"
    )

    const tickers = React.useMemo(() => {
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


    if (txLoading || posLoading) return <p className="p-6">Loading...</p>
    if (txError || posError) {
        const errorMessage = txError?.message || posError?.message || "Unknown error"
        return <p className="p-6 text-red-500">Error: {errorMessage}</p>
    }

    const HistoryBlock = () => (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-base sm:text-lg">Transaction History</h4>
                    <p data-slot="card-description" className="text-gray-500 text-xs sm:text-sm">All your buy and sell transactions</p>
                </div>

                <PrimaryButton>
                    <Upload className="w-4 h-4 mr-2 inline" />
                    Upload Transactions
                </PrimaryButton>
            </div>
            <TransactionsTable transactions={transactions || []}/>
        </Card>
    )

    const PositionsBlock = () => (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="text-base sm:text-lg">Current Positions</h4>
                    <p data-slot="card-description" className="text-gray-500 text-xs sm:text-sm">All your current holdings with live market data</p>
                </div>
            </div>
            <PositionsTable positions={positions || []} />
        </Card>
    )


    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
                <p className="text-gray-500 text-sm sm:text-base ">View your transaction history and current positions</p>
            </header>

            <div className="">
                <AnimatedTabs
                    tabs={[
                        { value: "history", label: "Transaction History", content: <HistoryBlock /> },
                        { value: "positions", label: "Current Positions", content: <PositionsBlock /> },
                    ]}
                />
            </div>
        </div>
    )
}