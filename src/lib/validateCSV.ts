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
                    reject(new Error(`Missing headers:${missing.join(", ")}`))
                } else {
                    resolve(true)
                }
            },
            error: (err) => reject(err),
        })
    })
}