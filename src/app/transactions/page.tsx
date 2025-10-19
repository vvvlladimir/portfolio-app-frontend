"use client"

import useSWR from "swr"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"
import { DataTable } from "@/shared/components/tables/DataTable"
import { Transaction} from "@/shared/types/transaction"
import { Position } from "@/shared/types/position"
import { AnimatedTabs } from "@/shared/components/ui/AnimatedTabs"
import React, {useEffect, useState} from "react";
import {useTickerStore} from "@/shared/stores/useTickerStore"
import {transactionsColumns} from "@/app/transactions/transactionsColumns";
import {positionsColumns} from "@/app/transactions/positionsColumns";
import {UpdateTransactionsDialog} from "@/shared/components/dialogs/UpdateTransactionsDialog";
import {Button} from "@/shared/components/ui/button";
import {exportToCSV} from "@/shared/lib/csv";
import {Download} from "lucide-react";
import {fetcher} from "@/shared/lib/swrFetcher";
import {API_CONFIG} from "@/config/api";
import {SiteHeader} from "@/shared/components/widgets/site-header";


export default function TransactionsPage() {
    const [transOpen, setTransOpen] = useState(false)

    const { data: transactions, error: txError, isLoading: txLoading } = useSWR<Transaction[]>(
        API_CONFIG.endpoints.transactions.get({ include_ticker_info: true }),
        fetcher,
        {
            shouldRetryOnError: false,
        }
    )

    const { data: positions, error: posError, isLoading: posLoading } = useSWR<Position[]>(
        API_CONFIG.endpoints.positions.snapshot(),
        fetcher,
        {
            shouldRetryOnError: false,
        }
    )
    // console.log(positions)

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
                        <CardAction className={"flex gap-x-2"}>
                            <Button
                                onClick={() => exportToCSV(transactions || [], "transactions.csv")}
                                disabled={!transactions?.length}
                                className={"order-5"}
                            >
                                <Download/>
                            </Button>
                            <UpdateTransactionsDialog
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

                    <CardAction className={"flex gap-x-2"}>
                        <Button
                            onClick={() => exportToCSV(transactions || [], "transactions.csv")}
                            disabled={!transactions?.length}
                            className={"order-5"}
                        >
                            <Download/>
                        </Button>
                        <UpdateTransactionsDialog
                            onOpenChange={setTransOpen}
                            open={transOpen}
                        />
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={transactionsColumns}
                        data={transactions}
                        defaultSorting={[{ id: "date", desc: true }]}
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
                        <CardAction className={"flex gap-x-2"}>
                            <Button
                                onClick={() => exportToCSV(positions || [], "positions.csv")}
                                disabled={!transactions?.length}
                                className={"order-5"}
                            >
                                <Download/>
                            </Button>
                        </CardAction>
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
                    <CardAction className={"flex gap-x-2"}>
                        <Button
                            onClick={() => exportToCSV(positions || [], "positions.csv")}
                            disabled={!transactions?.length}
                            className={"order-5"}
                        >
                            <Download/>
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={positionsColumns}
                        data={positions}
                    />
                </CardContent>
            </Card>
        )
    }

    const tabs = [
        {
            value: "history",
            label: "Transaction History",
            content: <TransactionsBlock />
        },
        {
            value: "positions",
            label: "Current Positions",
            content: <PositionsBlock />
        },
    ]

    return (
        <main>
            <SiteHeader headerTitle="Transactions"/>
            <div className="gap-4 p-4">
                <AnimatedTabs tabs={tabs}/>
            </div>
        </main>
    )
}