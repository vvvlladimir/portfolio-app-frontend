import {TransactionType} from "@/shared/types/transaction";

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
    total_pnl: number
    ticker_info: {
        currency: string,
        long_name: string,
        exchange: string,
        asset_type: PositionType
    }
}
