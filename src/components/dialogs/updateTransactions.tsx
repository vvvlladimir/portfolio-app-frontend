import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {AlertCircle, FileText, Upload} from "lucide-react"
import React, {useState} from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Alert, AlertDescription} from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import {AnimatedTabs} from "@/components/ui/AnimatedTabs";
import {ManualTransactionsForm} from "@/components/forms/ManualTransactionsForm";
import { useUpload } from "@/hooks/useUpload";
import { TransactionsFormData } from "@/services/transactionService";
import {useSWRConfig} from "swr";

interface UploadTransactionsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void,
}

export function UpdateTransactions({open, onOpenChange }: UploadTransactionsDialogProps) {
    const [activeTab, setActiveTab] = useState<string>("csv")
    const { mutate } = useSWRConfig()

    const {
        status,
        selectedFile,
        dragActive,
        error,
        handleDragEvents,
        handleFileDrop,
        handleFileSelect,
        uploadTransactions,
        resetUpload

    } = useUpload(() => {
        mutate("http://localhost:8000/portfolio/transactions")
        mutate("http://localhost:8000/portfolio/last-positions")

        onOpenChange(false)
    })

    const CSVBlock = () => {
        return (
            <>
            <DialogHeader>
                <DialogTitle>Upload Transaction History</DialogTitle>
                <DialogDescription>
                    Upload a CSV file containing your transaction history to automatically populate your portfolio.
                </DialogDescription>
            </DialogHeader><Card
                className={`relative py-0 border-2 border-dashed transition-colors ${dragActive
                    ? "border-primary bg-primary/5"
                    : selectedFile
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50"}`}
                onDragEnter={handleDragEvents}
                onDragLeave={handleDragEvents}
                onDragOver={handleDragEvents}
                onDrop={handleFileDrop}
            >
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    {selectedFile ? (
                        <div>
                            {status === "idle" && <FileText className="h-12 w-12 mx-auto"/>}
                            {status === "loading" && <Loader2 className="h-12 w-12 mx-auto animate-spin"/>}
                            {status === "success" && <CheckCircle className="h-12 w-12 mx-auto text-green-500"/>}
                            {status === "error" && <XCircle className="h-12 w-12 mx-auto text-red-500"/>}
                            <div>
                                <p className="font-medium text-green-700 dark:text-green-400">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto"/>
                            <div>
                                <p className="font-medium">Drag and drop your CSV file here</p>
                                <p className="text-sm text-muted-foreground">or click to browse</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive" className="mt-4 w-full">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
            </Card>
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    <strong>CSV Format Requirements:</strong>
                    <br />
                    Your CSV should include columns:
                    <div className="text-xs text-muted-foreground bg-muted p-3 rounded font-mono break-words w-full min-w-0">
                        Date,Symbol,Type,Shares,Total,Currency<br />
                        2024-01-15,AAPL,Buy,10,1500.00,USD<br />
                        2024-01-20,MSFT,Buy,5,1500.00,USD
                    </div>
                </AlertDescription>
            </Alert>

            <DialogFooter>
                <DialogClose asChild>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            resetUpload()
                            onOpenChange(false)
                        }}
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    onClick={() => uploadTransactions(selectedFile!)}
                    disabled={!selectedFile || status === "loading"}
                >
                    {status === "loading" ? "Uploading..." : "Upload Transactions"}
                </Button>
            </DialogFooter>
            </>
        )
    }

    const ManualBlock = () => {
        const handleManualFormSubmit = (data: TransactionsFormData) => {
            uploadTransactions(data);
        };

        return (
            <>
                <DialogHeader>
                    <DialogTitle>Upload Transaction History</DialogTitle>
                    <DialogDescription>
                        Add transactions manually to populate your portfolio.
                    </DialogDescription>
                </DialogHeader>

                <ManualTransactionsForm onSubmit={handleManualFormSubmit} />

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription className="text-sm">{error}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                resetUpload()
                                onOpenChange(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form="manual-transactions-form"
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Submitting..." : "Upload Transactions"}
                    </Button>
                </DialogFooter>
            </>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Upload/>
                        Upload Transactions
                    </Button>
                </DialogTrigger>
                <DialogContent className={`overflow-y-auto sm:h-[80%] h-[95%] ${activeTab === "csv" ? "sm:max-w-[60%]" : "sm:max-w-[90%]"}`}>
                    <AnimatedTabs
                        tabs={[
                            { value: "csv", label: "CSV", content: <CSVBlock/> },
                            { value: "manual", label: "Manual", content: <ManualBlock/> },
                        ]}
                        className={"mt-2"}
                        classNameContent={"flex flex-col gap-4"}
                        defaultValue={"csv"}
                        onValueChange={setActiveTab}
                    />
                </DialogContent>
            </form>
        </Dialog>
    )
}
