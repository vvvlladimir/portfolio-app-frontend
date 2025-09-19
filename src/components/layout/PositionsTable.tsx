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
import {LiveTicker, Position} from "@/types/schemas"
import { formatData } from "@/lib/formatData"
import {ProfitBadge} from "@/components/ui/ProfitBadge";

export function PositionsTable({positions, liveData,}: { positions: Position[], liveData: Record<string, LiveTicker> })  {
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
                            {formatData(tx.position_value, tx.ticker_info.currency)}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums">
                            {formatData(tx.price , tx.ticker_info.currency)}
                        </TableCell>
                        <TableCell className="font-mono tabular-nums text-right">
                            <ProfitBadge
                                value={liveData[tx.ticker]?.change ?? tx.market_daily_return_pct * tx.position_value }
                                percent={liveData[tx.ticker]?.changePercent ?? tx.market_daily_return_pct}
                                currency={tx.ticker_info.currency}
                            />

                        </TableCell>
                        <TableCell className="font-mono tabular-nums text-sm text-right">
                            <ProfitBadge
                                className="text-right"
                                value={tx.total_pnl}
                                currency={tx.ticker_info.currency}
                                invested={tx.position_value - tx.total_pnl}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </ShadTable>
    )
}