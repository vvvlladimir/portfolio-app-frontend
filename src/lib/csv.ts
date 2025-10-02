import Papa from "papaparse"

export const validateCSV = (file: File, requiredHeaders: string[]): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            preview: 5,
            complete: (results) => {
                const headers = results.meta.fields ?? []
                const missing = requiredHeaders.filter(h => !headers.includes(h))

                if (missing.length > 0) {
                    reject(new Error(`Missing headers: ${missing.join(", ")}`))
                } else {
                    resolve(true)
                }
            },
            error: (err) => reject(err),
        })
    })
}

export function exportToCSV<T>(data: T[], filename = "transactions.csv") {
    if (!data || !data.length) return

    const headers = Object.keys(data[0] as Record<string, unknown>)
    const rows = data.map((row) =>
        headers.map((field) => JSON.stringify((row as Record<string, unknown>)[field] ?? "")).join(",")
    )

    const csvContent = [headers.join(","), ...rows].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}