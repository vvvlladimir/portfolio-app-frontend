"use client"

import useSWR from "swr"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/shadcn/card"
import { DataTable } from "@/shared/components/tables/DataTable"
import { Transaction} from "@/shared/types/transaction"
import { AnimatedTabs } from "@/shared/components/ui/AnimatedTabs"
import React, {useState} from "react";
import {transactionsColumns} from "@/app/transactions/transactionsColumns";
import {positionsColumns} from "@/app/transactions/positionsColumns";
import {UpdateTransactionsDialog} from "@/shared/components/dialogs/UpdateTransactionsDialog";
import {Button} from "@/shared/components/ui/shadcn/button";
import {exportToCSV} from "@/shared/lib/csv";
import {Download} from "lucide-react";
import {fetcher} from "@/shared/api/client";
import {API_CONFIG} from "@/config/api";
import {SiteHeader} from "@/shared/components/widgets/site-header";
import {usePositions} from "@/shared/api/queries/usePositions";
import {useTransactions} from "@/shared/api/queries/useTransactions";
import {useTickers} from "@/shared/api/queries/useTickers";
import {joinByKey} from "@/shared/lib/utils";


export default function TransactionsPage() {
    const [transOpen, setTransOpen] = useState(false)

    const {positions, isError: posError} = usePositions({get_last: true})
    const {transactions, isError: transError} = useTransactions()
    const {tickers} = useTickers()

    const positionsData = joinByKey(positions, tickers, "ticker", "ticker_info")
    const transactionsData = joinByKey(transactions, tickers, "ticker", "ticker_info")

    const TransactionsBlock = () => {
        if (transError || !transactions?.length) {
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
                        data={transactionsData}
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
                        data={positionsData}
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