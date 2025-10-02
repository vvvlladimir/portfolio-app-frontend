import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import {Transaction} from "@/types/schemas";
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
import {DataTableColumnHeader} from "@/components/layout/DataTableColumnHeader";
import React from "react";

export const transactionsColumns: ColumnDef<Transaction>[] = [
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
        accessorKey: "date",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Date"/>
        },
        cell: ({ row }) => {
            const data = row.getValue("date") as string

            return <div className="">{formatDate(data)}</div>
        }
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
            const data = row.getValue("type") as BadgeVariant

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
        accessorFn: (row) => parseFloat(String(row.value)) / parseFloat(String(row.shares)),
        id: "price",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Price" className="text-right"/>
        },
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("value")) / parseFloat(row.getValue("shares"))
            const currency = row.original.currency as string

            return <div className="font-mono tabular-nums text-right">{formatData(data, currency)}</div>
        }
    },
    {
        accessorKey: "value",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Total" className="text-right"/>
        },
        cell: ({ row }) => {
            const data = parseFloat(row.getValue("value"))
            const currency = row.original.currency as string

            return <div className="font-mono tabular-nums text-right">{formatData(data, currency)}</div>
        }
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const id = (row.original.id).toString()

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

