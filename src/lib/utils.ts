import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {PositionType} from "@/types/schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}