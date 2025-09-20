"use client"

import React from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { TypeBadge } from "@/components/ui/TypeBadge"
import { Position } from "@/types/schemas"
import { formatData } from "@/lib/formatData"
import { ProfitBadge } from "@/components/ui/ProfitBadge"
import { useTickerData } from "@/stores/useTickerStore"

interface PositionRowProps {
  position: Position
}

export const PositionRow = React.memo(({ position }: PositionRowProps) => {
  const live = useTickerData(position.ticker)

  return (
    <TableRow className="border-b border-b-gray-300 dark:border-b-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
      {/* Ticker */}
      <TableCell className="whitespace-nowrap w-max">{position.ticker}</TableCell>

      {/* Name */}
      <TableCell className="max-w-[12rem] truncate">{position.ticker_info.long_name}</TableCell>

      {/* Type */}
      <TableCell>
        <TypeBadge type={position.ticker_info.asset_type} />
      </TableCell>

      {/* Shares */}
      <TableCell className="font-mono tabular-nums">{position.shares}</TableCell>

      {/* Position Value */}
      <TableCell className="font-mono tabular-nums">
        {formatData(position.position_value, position.ticker_info.currency)}
      </TableCell>

      {/* Price (static from position) */}
      <TableCell className="font-mono tabular-nums">
        {formatData(position.price, position.ticker_info.currency)}
      </TableCell>

      {/* Day Change (live per ticker) */}
      <TableCell className="font-mono tabular-nums text-right">
          <ProfitBadge
              value={
                  live?.change != null
                      ? live.change * position.shares
                      : position.market_daily_return_pct * position.position_value
              }
              percent={live?.changePercent ?? position.market_daily_return_pct}
              currency={position.ticker_info.currency}
          />
      </TableCell>

      {/* Total Return */}
      <TableCell className="font-mono tabular-nums text-sm text-right">
        <ProfitBadge
          className="text-right"
          value={position.total_pnl}
          currency={position.ticker_info.currency}
          invested={position.position_value - position.total_pnl}
        />
      </TableCell>
    </TableRow>
  )
})

PositionRow.displayName = "PositionRow"

