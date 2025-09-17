export function formatData(value: number, currency: string): string {
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

export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short", // 👉 "Jan"
        day: "numeric", // 👉 "15"
    }).format(date)
}