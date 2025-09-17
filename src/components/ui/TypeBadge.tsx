import { TransactionType, PositionType } from "@/types/schemas"

// Union всех значений
type TransactionTypeValues = `${TransactionType}`
type PositionTypeValues = `${PositionType}`

export type BadgeVariant = TransactionTypeValues | PositionTypeValues

// Цвета
const badgeColors: Record<BadgeVariant, string> = {
    // TransactionType
    BUY: "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100",
    SELL: "bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-100",
    DEPOSIT: "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100",
    WITHDRAW: "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100",

    // PositionType
    EQUITY: "bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-blue-100",
    ETF: "bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100",
    CRYPTOCURRENCY: "bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-100",
}

// Лейблы для отображения
const badgeLabels: Record<BadgeVariant, string> = {
    // TransactionType
    BUY: "BUY",
    SELL: "SELL",
    DEPOSIT: "DEPOSIT",
    WITHDRAW: "WITHDRAW",

    // PositionType
    EQUITY: "STOCK",
    ETF: "ETF",
    CRYPTOCURRENCY: "CRYPTO",
}

export function TypeBadge({ type }: { type: BadgeVariant }) {
    const colorClass =
        badgeColors[type] ?? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"
    const label = badgeLabels[type] ?? type

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded ${colorClass}`}>
      {label}
    </span>
    )
}