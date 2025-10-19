import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { cn } from "@/shared/lib/utils"
import { useEffect, useRef, useState } from "react"

interface ReturnBadgeProps {
    value: number
    animate?: boolean
}

export function ReturnBadge({ value, animate = false }: ReturnBadgeProps) {
    const formatted = value?.toFixed(2)
    const isPositive = value > 0

    const [highlight, setHighlight] = useState("")
    const prevValue = useRef<number>(value)

    useEffect(() => {
        if (!animate) return
        if (value === prevValue.current) return

        if (value > prevValue.current) {
            setHighlight("animate-highlightGreen")
        } else {
            setHighlight("animate-highlightRed")
        }

        prevValue.current = value

        const timeout = setTimeout(() => setHighlight(""), 600)
        return () => clearTimeout(timeout)
    }, [value, animate])

    return (
        <Badge
            variant="outline"
            className={cn(
                "transition-colors duration-300",
                isPositive ? "text-green-600 border-green-600" : "text-red-600 border-red-600",
                highlight
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