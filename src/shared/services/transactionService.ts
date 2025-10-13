import { z } from "zod";

export const transactionSchema = z.object({
    date: z.date(),
    ticker: z
        .string()
        .min(1, { message: "Symbol is required" })
        .max(10, { message: "Symbol too long (max. 10 characters)" }),
    type: z
        .enum(["BUY", "SELL"] as const)
        .refine((val) => ["BUY", "SELL"].includes(val), {
            message: "Invalid transaction type",
        }),
    shares: z.coerce.number()
        .refine((val) => val > 0, { message: "Shares must be greater than 0" }),
    value: z.coerce.number()
        .refine((val) => val > 0, { message: "Value must be greater than 0" }),
    currency: z
        .string()
        .min(1, { message: "Currency is required" })
        .length(3, { message: "Currency must be exactly 3 characters (e.g. EUR)" }),
});

export const transactionsFormSchema = z.object({
    transactions: z.array(transactionSchema).min(1, { message: "At least one transaction" }),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionsFormData = z.infer<typeof transactionsFormSchema>;

export interface TransactionSubmissionResult {
    success: boolean;
    message?: string;
    data?: unknown;
}

export class TransactionService {
    static createEmptyTransaction(): Transaction {
        return {
            date: new Date(),
            ticker: "",
            type: "BUY",
            shares: 1,
            value: 1,
            currency: "",
        };
    }
}
