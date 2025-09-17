"use client"

import { useState } from "react"

export default function Hello({ name }: { name: string }) {
    const [count, setCount] = useState(0)

    return (
        <div>
            <p className="mb-2">Привет, {name}! 👋</p>
            <p className="mb-2">Ты нажал {count} раз</p>
            <button
                onClick={() => setCount(count + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                +1
            </button>
        </div>
    )
}