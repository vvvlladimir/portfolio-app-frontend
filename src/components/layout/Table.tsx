import { TypeBadge } from "@/components/ui/TypeBadge"
import { Transaction } from "@/app/types"
import { formatCurrency } from "@/lib/formatCurrency"


export function Table({ transactions }: { transactions: Transaction[] }) {
    return (
        <table className="w-full text-left">
            <thead>
            <tr className="border-b text-gray-500">
                <th className="py-2">Date</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                    <td className="py-2">{tx.date}</td>
                    <td>
                        <div className="font-medium">{tx.ticker}</div>
                        {/*<div className="text-sm text-gray-500">{tx.currency}</div>*/}
                    </td>
                    <td>{tx.type}</td>
                    <td>{tx.shares}</td>
                    <td className="p-2">
                        {formatCurrency(tx.value, tx.currency)}
                    </td>
                    <td className="p-2">
                        {formatCurrency(tx.shares * tx.value, tx.currency)}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}