'use client';

import { ReactNode } from "react";
import { Card, CardTitle } from "./shadcn/card";
import { cn } from "@/shared/lib/utils";
import {FitTextSvg} from "@/shared/components/ui/FitTextSvg";

interface StatCardProps {
    label: string;
    value: string;
    tooltip?: ReactNode;
    className?: string;
    titleClassName?: string;
}

export function StatCard({ label, value, tooltip, className, titleClassName }: StatCardProps) {
    return (
        <Card className={cn("@container/card p-4 justify-between gap-2", className)}>
            <div className="flex gap-2 items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                {tooltip}
            </div>

            <div className="w-full flex items-center">
                <CardTitle className={cn("min-w-0 rounded-sm", titleClassName)}>
                    <FitTextSvg text={value} className="h-10" textClassName={cn("font-bold font-mono! tabular-nums")} />
                </CardTitle>
            </div>
        </Card>
    );
}