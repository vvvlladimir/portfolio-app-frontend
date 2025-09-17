"use client"

import { useEffect, useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

interface HistoryPoint {
    date: string
    total_value: number
}

export default function PortfolioPage() {
    const [data, setData] = useState<HistoryPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/portfolio/history")
                if (!res.ok) {
                    throw new Error(`Ошибка HTTP: ${res.status}`)
                }
                const json = await res.json()
                console.log("API response:", json)

                if (Array.isArray(json)) {
                    setData(json)
                } else if (json.data) {
                    setData(json.data)
                }
            } catch (err: any) {
                console.error("Fetch error:", err)
                setError(err.message || "Не удалось загрузить данные")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <p className="p-6">⏳ Загрузка...</p>
    }

    if (error) {
        return <p className="p-6 text-red-500">Ошибка: {error}</p>
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">📊 Portfolio History</h1>
            <div className="bg-white shadow-md rounded-lg p-4 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        {/*<Line type="monotone" dataKey="total_value" stroke="#8884d8" activeDot={{ r: 8 }} />*/}
                        {/*<Line type="monotone" dataKey="invested_value" stroke="#82ca9d" />*/}
                        <Line type="monotone" dataKey="return_pct" stroke="#000" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}