import {LiveTicker, useTickerData} from "@/shared/stores/useTickerStore";
import {ProfitBadge} from "@/shared/components/ui/ProfitBadge";
import { Row } from "@tanstack/react-table";
import {Position} from "@/shared/types/position";

interface LiveTickerProps {
    row: Row<Position>
    className?: string
}

export function getDayChange(row: Position, live?: LiveTicker) {
    return live?.change != null
        ? live.change * row.shares : 0
}

export const DayChangeCell = ({ row, className }: LiveTickerProps) => {
    const original = row.original
    const live = useTickerData(row.getValue("ticker")) as LiveTicker

    return (
        <ProfitBadge
            className={className}
            value={getDayChange(original, live)}
            percent={live?.changePercent}
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
            percent={(
                original.total_pnl / (original.shares * original.close) * 100
            )}
        />
    )
}