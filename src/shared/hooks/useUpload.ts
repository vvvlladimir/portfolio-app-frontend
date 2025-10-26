import {useState, useCallback} from "react"
import {TransactionsFormData} from "@/shared/services/transactionService"
import Papa from "papaparse"
import {useTransactions} from "@/shared/api/queries/useTransactions"
import {validateCSV} from "@/shared/lib/csv"

export type UploadStatus = "idle" | "loading" | "success" | "error"

export interface UseUploadState {
    status: UploadStatus
    selectedFile: File | null
    error: string | null
    dragActive: boolean

    handleFileValidation: (file: File) => Promise<void>
    handleDragEvents: (e: React.DragEvent) => void
    handleFileDrop: (e: React.DragEvent) => void
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void

    uploadTransactions: (source: UploadSource) => Promise<void>
    resetUpload: () => void
}

type UploadSource = File | TransactionsFormData

const CSV_HEADERS = ["Date", "Ticker", "Type", "Shares", "Value", "Currency"]

export function useUpload(onSuccess?: () => void): UseUploadState {
    const { upload } = useTransactions()

    // Upload state
    const [status, setStatus] = useState<UploadStatus>("idle")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const resetUpload = useCallback(() => {
        setStatus("idle")
        setSelectedFile(null)
        setDragActive(false)
        setError(null)
    }, [])

    // Upload functions
    const handleFileValidation = useCallback(async (file: File) => {
        try {
            // Validation of file type
            if (!file.type.includes("csv") && !file.name.endsWith(".csv")) {
                setError("File should be in CSV format")
                setSelectedFile(null)
                return
            }

            // Validate CSV structure
            await validateCSV(file, CSV_HEADERS)

            setSelectedFile(file)
            setError(null)
        } catch (err) {
            setError((err as Error)?.message || "CSV validation failed")
            setSelectedFile(null)
        }
    }, [])

    const handleDragEvents = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileValidation(e.dataTransfer.files[0])
        }
    }, [handleFileValidation])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileValidation(e.target.files[0])
        }
    }, [handleFileValidation])

    const uploadTransactions = useCallback(async (source: UploadSource) => {
        try {
            setStatus("loading")

            let file: File

            if (source instanceof File) {
                file = source
            } else {
                const csv = Papa.unparse(source.transactions)
                const blob = new Blob([csv], {type: "text/csv"})
                file = new File([blob], "manual.csv", {type: "text/csv"})
            }

            await upload(file)

            setStatus("success")
            setError(null)
            setTimeout(() => {
                resetUpload()
                onSuccess?.()
            }, 1000)
        } catch (err) {
            setStatus("error")
            setError((err as Error)?.message || "Unexpected error")
        }
    }, [upload, onSuccess, resetUpload])

    return {
        status,
        selectedFile,
        dragActive,
        error,

        handleFileValidation,
        handleDragEvents,
        handleFileDrop,
        handleFileSelect,
        resetUpload,

        uploadTransactions
    }
}
