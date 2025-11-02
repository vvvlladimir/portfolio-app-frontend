import {Ticker} from "@/shared/types/ticker";

export enum PositionType {
    EQUITY = "EQUITY",
    ETF = "ETF",
    CRYPTOCURRENCY = "CRYPTOCURRENCY",
}

export interface Position {
    date: string
    ticker: string
    shares: number
    close: number
    gross_invested: number
    gross_withdrawn: number
    cum_invested: number
    cum_withdrawn: number
    total_pnl: number
    ticker_info: Ticker
}

export interface StatsPeriods {
    start_date: string
    end_date: string
    twr_pct?: number
    pnl_abs: number
    cash_in: number
    cash_out: number
    mv_start: number
    mv_end: number
}

export interface StatsPosition {
    ticker: string
    as_of: string
    currency?: string
    market_value: number
    total_pnl: number
    total_pnl_pct?: number
    cum_invested: number
    cum_withdrawn: number
    periods: Record<string, StatsPeriods>
}
