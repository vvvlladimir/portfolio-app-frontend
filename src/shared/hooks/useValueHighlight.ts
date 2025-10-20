import {useEffect, useRef, useState} from "react"

export function useValueHighlight<T>(value: T, animate = true) {
    const [highlight, setHighlight] = useState("")
    const prevValue = useRef(value)

    useEffect(() => {
        if (!animate) return
        if (value === prevValue.current) return

        if (typeof value === "number" && typeof prevValue.current === "number") {
            setHighlight(value > prevValue.current ? "animate-highlightGreen" : "animate-highlightRed")
        } else {
            setHighlight("animate-highlightNeutral")
        }

        prevValue.current = value
        const timeout = setTimeout(() => setHighlight(""), 600)
        return () => clearTimeout(timeout)
    }, [value, animate])

    return highlight
}