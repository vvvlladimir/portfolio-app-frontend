"use client";

import React from "react";
import {useForm, useFieldArray, Resolver} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {CalendarWithInput} from "@/components/ui/CalendarWithInput";
import {
    TransactionsFormData,
    transactionsFormSchema,
    TransactionService
} from "@/services/transactionService";
import {transactionTypes} from "@/types/schemas";

interface Props {
    onSubmit?: (data: TransactionsFormData) => void;
}

export function ManualTransactionsForm({ onSubmit }: Props) {
    const form = useForm<TransactionsFormData>({
        resolver: zodResolver(transactionsFormSchema) as Resolver<TransactionsFormData>,
        defaultValues: {
            transactions: [TransactionService.createEmptyTransaction()],
        },
        mode: "onBlur",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "transactions",
    });

    const handleAdd = () => {
        append(TransactionService.createEmptyTransaction());
    };

    const onFormSubmit = async (data: TransactionsFormData) => {
        onSubmit?.(data);
    };

    return (
        <Form {...form}>
            <form
                id="manual-transactions-form"
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-4"
            >
                <div className="grid grid-cols-[repeat(6,1fr)_0.3fr] gap-2 font-medium">
                    <div>Date</div>
                    <div>Symbol</div>
                    <div>Type</div>
                    <div>Shares</div>
                    <div>Value</div>
                    <div>Currency</div>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[repeat(6,1fr)_0.3fr] gap-2 items-end">
                            <FormField
                                control={form.control}
                                name={`transactions.${index}.date`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormMessage asTooltip>
                                            <FormControl>
                                                <CalendarWithInput
                                                    value={field.value as Date}
                                                    onChange={(d) => field.onChange(d)}
                                                    placeholder="Select date"
                                                />
                                            </FormControl>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`transactions.${index}.ticker`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormMessage asTooltip>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ticker (e.g., AAPL)"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </FormControl>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`transactions.${index}.type`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormMessage asTooltip>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-full min-w-0">
                                                        <SelectValue placeholder={"Type"}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {transactionTypes.map((t) => (
                                                        <SelectItem key={t} value={t}>
                                                            {t}
                                                        </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`transactions.${index}.shares`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormMessage asTooltip>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Shares"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`transactions.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormMessage asTooltip>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="Total value"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`transactions.${index}.currency`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormMessage asTooltip>
                                            <FormControl>
                                                <Input
                                                    placeholder="Currency (e.g., USD)"
                                                    maxLength={3}
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                />
                                            </FormControl>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />
                    </div>
                ))}

                <Button type="button" variant="outline" onClick={handleAdd} className="w-full">
                    Add Another Transaction
                </Button>
            </form>
        </Form>
    );
}