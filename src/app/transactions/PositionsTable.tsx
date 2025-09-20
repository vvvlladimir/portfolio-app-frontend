"use client"

import { useState } from "react"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

import {
    Table as ShadTable,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
} from "@/components/ui/table"
import { Position } from "@/types/schemas"
import { PositionRow } from "./PositionRow"

export function PositionsTable({ positions }: { positions: Position[] }) {
    const [sortAsc, setSortAsc] = useState(true)

    const sortedPositions = [...(positions || [])].sort((a, b) => {
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
                    <TableHead className="">Position Value</TableHead>
                    <TableHead className="">Price</TableHead>
                    <TableHead className="text-right">Day Change</TableHead>
                    <TableHead className="text-right">Total Return</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedPositions.map((position) => (
                    <PositionRow key={position.ticker} position={position} />
                ))}
            </TableBody>
        </ShadTable>
    )
}