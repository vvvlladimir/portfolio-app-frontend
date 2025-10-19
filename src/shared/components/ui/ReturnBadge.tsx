import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"

interface ReturnBadgeProps {
    value: number
}

export function ReturnBadge({ value }: ReturnBadgeProps) {
    const formatted = value?.toFixed(2)
    const isPositive = value > 0

    return (
        <Badge
            variant="outline"
            className={cn(
                isPositive ? "text-green-600 border-green-600" : "text-red-600 border-red-600"
            )}
        >
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            {formatted}%
        </Badge>
    )
}