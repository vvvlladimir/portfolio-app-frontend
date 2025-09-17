"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

import {
    Table as ShadTable,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"
import { TypeBadge } from "@/components/ui/TypeBadge"
import { Position } from "@/types/schemas"
import { formatData } from "@/lib/formatData"

export function PositionsTable({ positions }: { positions: Position[] }) {
    const [sortAsc, setSortAsc] = useState(true)

    const sortedTx = [...(positions || [])].sort((a, b) => {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return sortAsc ? da - db : db - da
    })

    return (
        <ShadTable>
            <TableHeader>
                <TableRow>
                    <TableHead
                        className="w-32 cursor-pointer"
                        onClick={() => setSortAsc(!sortAsc)}
                    >
                        <div className="flex items-center gap-1">
                            <span>Symbol</span>
                            {sortAsc === null ? (
                                <ArrowUpDown className="w-4 h-4" />
                            ) : sortAsc ? (
                                <ArrowUp className="w-4 h-4" />
                            ) : (
                                <ArrowDown className="w-4 h-4" />
                            )}
                        </div>
                    </TableHead>
                    <TableHead className="">Name</TableHead>
                    <TableHead className="">Type</TableHead>
                    <TableHead className="">Shares</TableHead>
                    <TableHead className="">Price</TableHead>
                    <TableHead className="">Market Value</TableHead>
                    <TableHead className="text-right">Day Change</TableHead>
                    <TableHead className="text-right">Total Return</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedTx.map((tx) => (
                    <TableRow
                        key={`${tx.date}-${tx.ticker}`}
                        className="border-b border-b-gray-300 dark:border-b-gray-700
                            hover:bg-gray-50 dark:hover:bg-gray-800">

                        <TableCell className="whitespace-nowrap w-max">
                            {tx.ticker}
                        </TableCell>
                        <TableCell className="max-w-[12rem] truncate"> {tx.ticker_info.long_name} </TableCell>
                        <TableCell className="">
                            <TypeBadge type={tx.ticker_info.asset_type} />
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                            {tx.shares}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                            {formatData(tx.market_value, tx.ticker_info.currency)}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                            {formatData(tx.market_value / tx.shares , tx.ticker_info.currency)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </ShadTable>
    )
}