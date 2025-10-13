

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex items-center justify-center px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 transition dark:hover:bg-gray-300">
      {children}
    </button>
  )
}