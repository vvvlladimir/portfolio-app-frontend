import {TransactionType} from "@/types/transactions";

const typeColors: Record<TransactionType, string> = {
    BUY: "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100",
    SELL: "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100",
    DEPOSIT: "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100",
    WITHDRAW: "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100",
}

export function TypeBadge({ type }: { type: TransactionType }) {
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded ${typeColors[type]}`}>
      {type}
    </span>
    )
}