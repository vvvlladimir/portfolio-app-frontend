export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-card flex flex-col border-1 border-gray-300 dark:border-gray-700 rounded-2xl p-6 gap-6">{children}</div>
    )
}