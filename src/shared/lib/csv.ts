import Papa from "papaparse"
import { Parser as CSVParser } from "@json2csv/plainjs"
import { flatten } from "@json2csv/transforms"

export const validateCSV = (
    file: File,
    requiredHeaders: string[]
): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            preview: 5,
            complete: (results) => {
                const headers = results.meta.fields ?? []

                // trim + lowerCase + delete all spaces
                const normalize = (s: string) =>
                    s.trim().toLowerCase().replace(/\s+/g, "")

                const normalizedHeaders = headers.map(normalize)
                const normalizedRequired = requiredHeaders.map(normalize)

                const missing = normalizedRequired.filter(
                    (h) => !normalizedHeaders.includes(h)
                )

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

export function exportToCSV<T extends Record<string, any>>(data: T[], filename = "transactions.csv") {
    if (!data?.length) return

    const parser = new CSVParser({
        transforms: [flatten({ objects: true, arrays: true, separator: "." })],
    })

    const csv = parser.parse(data)

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
}