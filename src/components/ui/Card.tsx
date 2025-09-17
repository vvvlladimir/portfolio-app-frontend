export function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-card flex flex-col border border-black/10 rounded-xl p-6 gap-6">{children}</div>
    )
}