import {useState, useCallback} from "react"
import {UploadService, UploadStatus, FileValidationResult, UploadResult} from "@/services/uploadService"
import {TransactionService, TransactionsFormData, TransactionSubmissionResult} from "@/services/transactionService"
import Papa from "papaparse"

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

export function useUpload(onSuccess?: () => void): UseUploadState {
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
        const result: FileValidationResult = await UploadService.validateCSVFile(file)

        if (result.isValid && result.file) {
            setSelectedFile(result.file)
            setError(null)
        } else {
            setError(result.error || "File validation failed")
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
            const result: UploadResult = await UploadService.uploadCSV(file)

            if (result.success) {
                setStatus("success")
                setError(null)
                setTimeout(() => {
                    resetUpload()
                    onSuccess?.()
                }, 1000)
            } else {
                setStatus("error")
                setError(result.message || "Upload failed")
            }
        } catch (err) {
            setStatus("error")
            setError((err as Error)?.message || "Unexpected error")
        }
    }, [onSuccess, resetUpload])

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
