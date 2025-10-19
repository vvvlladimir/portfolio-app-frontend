import { cn } from "@/shared/lib/utils"
import { PositionType } from "@/shared/types/position"
import { TransactionType } from "@/shared/types/transaction"
import { Badge } from "@/shared/components/ui/badge"

type TransactionTypeValues = `${TransactionType}`
type PositionTypeValues = `${PositionType}`

export type BadgeVariant = TransactionTypeValues | PositionTypeValues

const badgeStyles: Record<BadgeVariant, string> = {
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

const badgeLabels: Record<BadgeVariant, string> = {
    BUY: "Buy",
    SELL: "Sell",
    DEPOSIT: "Deposit",
    WITHDRAW: "Withdraw",
    EQUITY: "Stock",
    ETF: "ETF",
    CRYPTOCURRENCY: "Crypto",
}

interface TypeBadgeProps {
    data: BadgeVariant
    className?: string
}

export function TypeBadge({ data, className }: TypeBadgeProps) {
    const label = badgeLabels[data] ?? data
    const colorClass =
        badgeStyles[data] ?? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100"

    return (
        <Badge
            variant="default"
            className={cn(colorClass, className)}
        >
            {label}
        </Badge>
    )
}