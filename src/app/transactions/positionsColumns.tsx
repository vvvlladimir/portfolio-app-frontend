import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import {Position} from "@/types/schemas";
import {formatData, formatDate} from "@/lib/formatData";
import {BadgeVariant, TypeBadge} from "@/components/ui/TypeBadge";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MoreHorizontal} from "lucide-react";
import {DayChangeCell, TotalReturnCell} from "@/components/layout/LiveTickerCell";
import React from "react";
import {DataTableColumnHeader} from "@/components/layout/DataTableColumnHeader";

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
        accessorKey: "position_value",
        header: () => <div className="">Position Value</div>,
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("position_value"))
            const tickerInfo = row.original.ticker_info

            return <div className="font-mono tabular-nums">{formatData(data, tickerInfo.currency)}</div>
        }
    },
    {
        accessorKey: "price",
        header: () => <div className="">Price</div>,
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("price"))
            const tickerInfo = row.original.ticker_info

            return <div className="font-mono tabular-nums">{formatData(data, tickerInfo.currency)}</div>
        }
    },
    {
        accessorKey: "day_change",
        header: () => <div className="text-right">Day Change</div>,
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
        header: () => <div className="text-right">Total Return</div>,
        cell: ({ row }) => {
            return (
                <div className={"text-right"}>
                    <TotalReturnCell
                        row={row}
                        className="text-right"
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

