"use client"

import useSWR from "swr"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TransactionsTable } from "@/app/transactions/TransactionsTable"
import { Transaction, Position } from "@/types/schemas"
import { AnimatedTabs } from "@/components/ui/AnimatedTabs"
import React, {useEffect, useState} from "react";
import {useTickerStore} from "@/stores/useTickerStore"
import {transactionsColumns} from "@/app/transactions/transactionsColumns";
import {positionsColumns} from "@/app/transactions/positionsColumns";
import {UpdateTransactions} from "@/components/dialogs/updateTransactions";


export default function TransactionsPage() {
    const [transOpen, setTransOpen] = useState(false)

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


    const TransactionsBlock = () => {
        if (txError || !transactions?.length) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>
                            No transactions found. Upload your CSV to get started.
                        </CardDescription>
                        <CardAction>
                            <UpdateTransactions
                                onOpenChange={setTransOpen}
                                open={transOpen}
                            />
                        </CardAction>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-10">
                        <p className="text-gray-500">You don’t have any data yet.</p>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        All your buy and sell transactions
                    </CardDescription>
                    <CardAction>
                        <UpdateTransactions
                            onOpenChange={setTransOpen}
                            open={transOpen}
                        />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <TransactionsTable
                        columns={transactionsColumns}
                        data={transactions}
                    />
                </CardContent>
            </Card>
        )
    }

    const PositionsBlock = () => {
        if (posError || !positions?.length) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Current Positions</CardTitle>
                        <CardDescription>
                            No positions available. Upload your transactions first.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-10">
                        <p className="text-gray-500">Waiting for your first upload…</p>
                    </CardContent>
                </Card>
            )
        }

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Current Positions</CardTitle>
                    <CardDescription>
                        All your current holdings with live market data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TransactionsTable
                        columns={positionsColumns}
                        data={positions}
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl sm:text-3xl font-bold">Transactions</h1>
                <p className="text-gray-500 text-sm sm:text-base ">View your transaction history and current positions</p>
            </header>

            <div className="">
                <AnimatedTabs
                    tabs={[
                        { value: "history", label: "Transaction History", content: <TransactionsBlock /> },
                        { value: "positions", label: "Current Positions", content: <PositionsBlock /> },
                    ]}
                />
            </div>
        </div>
    )
}