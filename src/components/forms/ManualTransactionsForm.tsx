"use client";

import React from "react";
import {useForm, useFieldArray, Resolver} from "react-hook-form";
import { z } from "zod";
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
import { TransactionType, transactionTypes } from "@/types/schemas";
import { X } from "lucide-react";
import {CalendarWithInput} from "@/components/ui/CalendarWithInput";

export const transactionSchema = z.object({
    date: z
        .date()
        .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
            message: "Date is required and must be valid",
        }),

    symbol: z
        .string()
        .min(1, { message: "Symbol is required" })
        .max(10, { message: "Symbol too long (max. 10 characters)" }),

    type: z
        .enum(transactionTypes)
        .refine((val) => transactionTypes.includes(val), {
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


const formSchema = z.object({
    transactions: z.array(transactionSchema).min(1, { message: "At least one transaction" }),
});

export type FormSchema = z.infer<typeof formSchema>;

interface Props {
    onSubmit: (data: FormSchema) => void;
}

export function ManualTransactionsForm({ onSubmit }: Props) {
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema) as Resolver<FormSchema>,
        defaultValues: {
            transactions: [
                {
                    date: new Date(),
                    symbol: "",
                    type: "BUY" as TransactionType,
                    shares: 1,
                    value: 1,
                    currency: "",
                },
            ],
        },
        mode: "onBlur",
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "transactions",
    });

    const handleAdd = () => {
        append({
            date: new Date(),
            symbol: "",
            type: "BUY" as TransactionType,
            shares: 0,
            value: 0,
            currency: "",
        });
    };

    const handleRemove = (index: number) => remove(index);

    const onFormSubmit = (data: FormSchema) => onSubmit(data);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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

                        {/* Date */}
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
                                                placeholder="dd.mm.yyyy"
                                            />
                                        </FormControl>
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* SYMBOL */}
                        <FormField
                            control={form.control}
                            name={`transactions.${index}.symbol`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormMessage asTooltip>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormMessage>
                                </FormItem>

                            )}
                        />

                        {/* TYPE */}
                        <FormField
                            control={form.control}
                            name={`transactions.${index}.type`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full min-w-0">
                                                <SelectValue/>
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* SHARES */}
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
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* VALUE */}
                        <FormField
                            control={form.control}
                            name={`transactions.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormMessage asTooltip>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* CURRENCY */}
                        <FormField
                            control={form.control}
                            name={`transactions.${index}.currency`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormMessage asTooltip>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <Button type="button" variant="destructive" onClick={() => handleRemove(index)}>
                            <X/>
                        </Button>
                    </div>
                ))}

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleAdd}>
                        + Add Transaction
                    </Button>
                    {/*<Button type="submit">Submit</Button>*/}
                </div>
            </form>
        </Form>
    );
}