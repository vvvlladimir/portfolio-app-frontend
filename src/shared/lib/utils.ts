import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sumField<T>(
    data: T[],
    field: keyof T
): number {
  return data.reduce((sum, item) => {
    const value = item[field];
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
}

export function joinByKey<
    T extends Record<K, unknown>,
    U extends Record<K, unknown>,
    K extends PropertyKey
>(
    base: T[],
    extra: U[],
    key: K,
    attachKey: string = "extra_info"
) {
  const map = new Map<unknown, U>(
      extra.map((item) => [item[key], item])
  )

  return base.map((item) => ({
    ...item,
    [attachKey]: map.get(item[key]),
  })) as (T & { [P in typeof attachKey]?: U })[]
}