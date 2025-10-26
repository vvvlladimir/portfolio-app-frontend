import {Ticker} from "@/shared/types/ticker";

export const transactionTypes = ["BUY", "SELL", "DEPOSIT", "WITHDRAW"] as const;
export type TransactionType = typeof transactionTypes[number];

export interface Transaction {
    id: number
    date: string
    type: TransactionType
    ticker: string
    currency: string
    shares: number
    value: number
    ticker_info?: Ticker
}