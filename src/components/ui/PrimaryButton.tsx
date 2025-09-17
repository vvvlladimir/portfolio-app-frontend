

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition">
      {children}
    </button>
  )
}