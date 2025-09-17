"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/Card"
import { PrimaryButton } from "@/components/ui/PrimaryButton"
import { Table } from "@/components/layout/Table"
import { Transaction } from "@/app/types"

export default function TransactionsPage() {
    const { data, error, isLoading } = useSWR<Transaction[]>(
        "http://localhost:8000/portfolio/transactions"
    )

    if (isLoading) return <p className="p-6">Loading...</p>
    if (error) return <p className="p-6 text-red-500">Error: {error.message}</p>

    return (
        <div className="p-6 space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Transactions</h1>
                <p className="text-gray-500">View your transaction history and current positions</p>
            </header>

            <div className="flex space-x-2">
                <PrimaryButton>Transaction History</PrimaryButton>
                <PrimaryButton>Current Positions</PrimaryButton>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold">Transaction History</h2>
                    <PrimaryButton>Upload Transactions</PrimaryButton>
                </div>
                <Table transactions={data || []} />
            </Card>
        </div>
    )
}