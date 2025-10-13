// export enum TransactionType {
//     BUY = "BUY",
//     SELL = "SELL",
//     DEPOSIT = "DEPOSIT",
//     WITHDRAW = "WITHDRAW",
// }

export const transactionTypes = ["BUY", "SELL", "DEPOSIT", "WITHDRAW"] as const;
export type TransactionType = typeof transactionTypes[number];

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