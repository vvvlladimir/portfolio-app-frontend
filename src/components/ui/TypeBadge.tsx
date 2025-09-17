export function TypeBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
      {children}
    </span>
    )
}