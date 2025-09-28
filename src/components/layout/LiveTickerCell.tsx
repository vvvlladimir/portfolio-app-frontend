import {LiveTicker, useTickerData} from "@/stores/useTickerStore";
import {ProfitBadge} from "@/components/ui/ProfitBadge";
import { Row } from "@tanstack/react-table";
import {Position} from "@/types/schemas";

interface LiveTickerProps {
    row: Row<Position>
    className?: string
}


export const DayChangeCell = ({ row, className }: LiveTickerProps) => {
    const original = row.original
    const live = useTickerData(row.getValue("ticker")) as LiveTicker

    return (
        <ProfitBadge
            className={className}
            value={
                live?.change != null
                    ? live.change * original.shares
                    : original.market_daily_return_pct * original.position_value
            }
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