import { useState } from "react"
import { TypeBadge } from "@/components/ui/TypeBadge"
import { Transaction } from "@/types/transactions"
import { formatData, formatDate } from "@/lib/formatData"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"


export function Table({ transactions }: { transactions: Transaction[] }) {
    const [sortAsc, setSortAsc] = useState(true)

    const sortedTx = [...(transactions || [])].sort((a, b) => {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return sortAsc ? da - db : db - da
    })

    return (
        <table className="w-full text-left table-auto">
            <thead>
            <tr className="border-b border-b-gray-300 dark:border-b-gray-700">
                <th className="pl-4 pb-2 text-left cursor-pointer whitespace-nowrap w-32 "
                    onClick={() => setSortAsc(!sortAsc)}>
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
                </th>
                <th className="text-left">Symbol</th>
                <th className="text-center">Type</th>
                <th className="text-right">Shares</th>
                <th className="text-right">Price</th>
                <th className="pr-4 text-right">Total</th>
            </tr>
            </thead>
            <tbody>
            {sortedTx.map((tx) => (
                <tr key={tx.id}
                    className="border-b border-b-gray-300 dark:border-b-gray-700
                            hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 text-left whitespace-nowrap w-max">{formatDate(tx.date)}</td>
                    <td className="text-left max-w-[12rem] truncate">
                        <div className="font-medium text-sm">{tx.ticker}</div>
                        <div className="text-xs text-gray-500">{tx.ticker_info.long_name}</div>
                    </td>
                    <td className="text-center">
                        <TypeBadge type={tx.type} />
                    </td>
                    <td className="text-right font-mono tabular-nums">{tx.shares}</td>
                    <td className="p-2 text-right font-mono tabular-nums">
                        {formatData(tx.value / tx.shares, tx.currency)}
                    </td>
                    <td className="p-2 text-right font-mono tabular-nums">
                        {formatData(tx.value, tx.currency)}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}