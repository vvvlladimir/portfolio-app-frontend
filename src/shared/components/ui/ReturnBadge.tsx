import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import {Badge} from "@/shared/components/ui/shadcn/badge";
import {useValueHighlight} from "@/shared/hooks/useValueHighlight";

export function ReturnBadge({ value, animate = false }: { value: number; animate?: boolean }) {
    const formatted = value.toFixed(2)
    const isPositive = value > 0
    const highlight = useValueHighlight(value)

    return (
        <Badge
            variant="outline"
            className={cn(
                "transition-colors duration-300",
                isPositive ? "text-green-600 border-green-600" : "text-red-600 border-red-600",
                animate ? highlight : ""
            )}
        >
            {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {formatted}%
        </Badge>
    )
}