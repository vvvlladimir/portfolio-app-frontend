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

export interface ReturnValue {
    [period: string]: number | null
}

export interface StatsPosition {
    percentReturn? : number
    ticker: string
    total_value: number
    total_pnl: number
    total_pnl_pct: number
    returns: ReturnValue
}
