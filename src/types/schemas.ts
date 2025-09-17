export enum TransactionType {
    BUY = "BUY",
    SELL = "SELL",
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
}

export enum PositionType {
    EQUITY = "EQUITY",
    ETF = "ETF",
    CRYPTOCURRENCY = "CRYPTOCURRENCY",
}


export interface Transaction {
    id: number
    date: string
    type: TransactionType
    ticker: string
    currency: string
    shares: number
    value: number
    ticker_info: {
        currency: string,
        long_name: string,
        exchange: string,
        asset_type: PositionType
    }
}

export interface Position {
    date: string
    ticker: string
    shares: number
    market_value: number
    ticker_info: {
        currency: string,
        long_name: string,
        exchange: string,
        asset_type: PositionType
    }
}