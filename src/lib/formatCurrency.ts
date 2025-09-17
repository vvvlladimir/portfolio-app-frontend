export function formatCurrency(value: number, currency: string): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            currencyDisplay: "symbol",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)
    } catch (e) {
        return `${currency} ${value.toFixed(2)}`
    }
}