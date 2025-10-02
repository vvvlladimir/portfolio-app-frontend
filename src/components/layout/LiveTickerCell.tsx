import {LiveTicker, useTickerData} from "@/stores/useTickerStore";
import {ProfitBadge} from "@/components/ui/ProfitBadge";
import { Row } from "@tanstack/react-table";
import {Position} from "@/types/schemas";

interface LiveTickerProps {
    row: Row<Position>
    className?: string
}

export function getDayChange(row: Position, live?: LiveTicker) {
    return live?.change != null
        ? live.change * row.shares
        : row.market_daily_return_pct * row.position_value
}

export const DayChangeCell = ({ row, className }: LiveTickerProps) => {
    const original = row.original
    const live = useTickerData(row.getValue("ticker")) as LiveTicker

    return (
        <ProfitBadge
            className={className}
            value={getDayChange(original, live)}
            percent={live?.changePercent ?? original.market_daily_return_pct}
            currency={original.ticker_info.currency}
        />
    )
}

export const TotalReturnCell = ({ row, className }: LiveTickerProps) => {
    const original = row.original
    const live = useTickerData(row.getValue("ticker")) as LiveTicker

    return (
        <ProfitBadge
            className={className}
            value={original.total_pnl}
            currency={original.ticker_info.currency}
            invested={original.position_value - original.total_pnl}
        />
    )
}