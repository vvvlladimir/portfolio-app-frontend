import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sumField<T extends Record<string, any>>(
    data: T[],
    field: keyof T
): number {
  return data.reduce((sum, item) => {
    const value = item[field];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}
