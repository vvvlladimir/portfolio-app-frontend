export interface Portfolio {
    currency: string
    history: {
        date: Date,
        total_value: number,
        invested_value: number,
        gross_invested: number,
        gross_withdrawn: number,
        total_pnl: number,
        total_pnl_pct: number
    }
}

export interface PortfolioWeights {
    ticker: string
    weight: number
}
