import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import {Position} from "@/shared/types/position";
import {formatData, formatDate} from "@/shared/lib/formatData";
import {BadgeVariant, TypeBadge} from "@/shared/components/ui/TypeBadge";
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {MoreHorizontal} from "lucide-react";
import {DayChangeCell, getDayChange, TotalReturnCell} from "@/shared/components/layout/LiveTickerCell";
import React from "react";
import {DataTableColumnHeader} from "@/shared/components/layout/DataTableColumnHeader";
import {LiveTicker, useTickerData, useTickerStore} from "@/shared/stores/useTickerStore";

export const positionsColumns: ColumnDef<Position>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "ticker",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Symbol"/>
        },
        cell: ({ row }) => {
            const data = String(row.getValue("ticker"))
            const tickerInfo = row.original.ticker_info

            return <div className="max-w-[15rem] truncate">
                <div className="font-medium text-sm">{data}</div>
                <div className="text-xs text-muted-foreground">
                    {tickerInfo.long_name}
                </div>
            </div>
        }
    },
    {
        accessorFn: (row) => row.ticker_info.asset_type,
        id: "type",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Type"/>
        },
        cell: ({ row }) => {
            const data = row.original.ticker_info.asset_type as BadgeVariant

            return <TypeBadge data={data} />
        }
    },
    {
        accessorKey: "shares",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Shares"/>
        },
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("shares"))

            return <div className="font-mono tabular-nums">{data}</div>
        }
    },
    {
        id: "value",
        accessorFn: (row) => (row.close * row.shares),
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Position Value"/>
        },
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("close")) * parseFloat(row.getValue("shares"))
            const tickerInfo = row.original.ticker_info

            return <div className="font-mono tabular-nums">{formatData(data, tickerInfo.currency)}</div>
        }
    },
    {
        accessorKey: "close",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Price"/>
        },
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("close"))
            const tickerInfo = row.original.ticker_info

            return <div className="font-mono tabular-nums">{formatData(data, tickerInfo.currency)}</div>
        }
    },
    {
        id: "day_change",
        accessorFn: (row) => {
            const live = useTickerStore.getState().liveData[row.ticker]
            return getDayChange(row, live);
        },
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Day Change" className="text-right" />
        ),
        cell: ({ row }) => {
            return (
                <div className={"text-right"}>
                    <DayChangeCell
                        row={row}
                    />
                </div>

            )
        }
    },
    {
        accessorKey: "total_pnl",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Total Return" className={"text-right"}/>
        },
        cell: ({ row }) => {
            return (
                <div className={"text-right"}>
                    <TotalReturnCell
                        row={row}
                    />
                </div>
            )
        }
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const id = (row.original.ticker).toString()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 ">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(id)}
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

