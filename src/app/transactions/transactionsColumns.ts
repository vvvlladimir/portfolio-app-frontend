import { ColumnDef } from "@tanstack/react-table"
import {Transaction} from "@/types/schemas";

export const transactionsColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "email",
        header: "Symbol",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "shares",
        header: "Shares",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "total",
        header: "Total",
    }
]