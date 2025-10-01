"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {TransactionType, transactionTypes} from "@/types/schemas";
import {TypeBadge} from "@/components/ui/TypeBadge" ;
import {CalendarIcon, X} from 'lucide-react';
import { Calendar } from "../ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import React from "react";



const transactionSchema = z.object({
    date: z.date({ message: "Date is required" }),
    symbol: z.string().nonempty({ message: "Symbol is required" }),
    type: z.enum(transactionTypes, { message: "Type is required" }),
    shares: z.number().min(0.0000001, { message: "Shares must be > 0" }),
    value: z.number().min(0.0000001, { message: "Value must be > 0" }),
    currency: z.string().nonempty({ message: "Currency is required" }),
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
        resolver: zodResolver(formSchema),
        defaultValues: {
            transactions: [
                {
                    date: undefined as unknown as Date,
                    symbol: "",
                    type: "BUY" as TransactionType,
                    shares: undefined as unknown as number,
                    value: undefined as unknown as number,
                    currency: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "transactions",
    });

    const handleAdd = () => {
        append({
            date: undefined as unknown as Date,
            symbol: "",
            type: "BUY" as TransactionType,
            shares: 0,
            value: 0,
            currency: "",
        });
    };

    const handleRemove = (index: number) => {
        remove(index);
    };

    const onFormSubmit = (data: FormSchema) => {
        onSubmit(data);
    };

    const [open, setOpen] = React.useState(false)

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onFormSubmit)}
                className="space-y-4"
            >
                <div className="grid grid-cols-[repeat(6,1fr)_0.3fr] gap-2  font-medium">
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
                                    {/*<Input*/}
                                    {/*    id="date"*/}
                                    {/*    value={field.value}*/}
                                    {/*    className="bg-background pr-10"*/}
                                    {/*    onChange={(e) => {*/}
                                    {/*        const dateValue = parseDate(e.target.value)*/}
                                    {/*        field.onChange(dateValue);*/}
                                    {/*    }}*/}
                                    {/*    onKeyDown={(e) => {*/}
                                    {/*        if (e.key === "ArrowDown") {*/}
                                    {/*            e.preventDefault()*/}
                                    {/*            setOpen(true)*/}
                                    {/*        }*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        field.value.toLocaleDateString()
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value || undefined}
                                                onSelect={field.onChange}>
                                            </Calendar>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`transactions.${index}.symbol`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`transactions.${index}.type`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className={"w-full min-w-0"}>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {transactionTypes.map((t) => (
                                                    <SelectItem key={t} value={t}>
                                                        {/*<TypeBadge data={t}/>*/}
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

                        <FormField
                            control={form.control}
                            name={`transactions.${index}.shares`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`transactions.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="any"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name={`transactions.${index}.currency`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleRemove(index)}
                        >
                            <X/>
                        </Button>
                    </div>
                ))}

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleAdd}>
                        + Add Transaction
                    </Button>
                </div>
            </form>
        </Form>
    );
}