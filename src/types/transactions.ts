export enum TransactionType {
    BUY = "BUY",
    SELL = "SELL",
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
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
        asset_type: string
    }
}