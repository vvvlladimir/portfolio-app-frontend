"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"

import { TypeBadge } from "@/components/ui/TypeBadge"
import { Transaction } from "@/types/schemas"
import { formatData, formatDate } from "@/lib/formatData"
import { useState } from "react"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}



export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
    const [sortAsc, setSortAsc] = useState(true)

    const sortedTx = [...(transactions || [])].sort((a, b) => {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return sortAsc ? da - db : db - da
    })

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className="w-32 cursor-pointer"
                        onClick={() => setSortAsc(!sortAsc)}
                    >
                        <div className="flex items-center gap-1">
                            <span>Date</span>
                            {sortAsc === null ? (
                                <ArrowUpDown className="w-4 h-4" />
                            ) : sortAsc ? (
                                <ArrowUp className="w-4 h-4" />
                            ) : (
                                <ArrowDown className="w-4 h-4" />
                            )}
                        </div>
                    </TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead className="text-center">Type</TableHead>
                    <TableHead className="text-right">Shares</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right pr-4">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedTx.map((tx) => (
                    <TableRow
                        key={tx.id}
                        className="border-b border-b-gray-300 dark:border-b-gray-700
                            hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <TableCell className="whitespace-nowrap w-max">
                            {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className="max-w-[12rem] truncate">
                            <div className="font-medium text-sm">{tx.ticker}</div>
                            <div className="text-xs text-muted-foreground">
                                {tx.ticker_info.long_name}
                            </div>
                        </TableCell>
                        <TableCell className="text-center">
                            <TypeBadge type={tx.type} />
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                            {tx.shares}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                            {formatData(tx.value / tx.shares, tx.currency)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums">
                            {formatData(tx.value, tx.currency)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}