"use client"

import { useEffect, useState } from "react"
import * as protobuf from "protobufjs"
import {LiveTicker} from "@/types/schemas";

export function TickerWebSocket(tickers: string[]) {
    const [info, setInfo] = useState<Record<string, LiveTicker>>({})

    useEffect(() => {
        if (!tickers.length) return
        console.log(tickers)

        let Yaticker: protobuf.Type
        let ws: WebSocket

        protobuf.load("/yaticker.proto").then((root) => {
            Yaticker = root.lookupType("yaticker")

            ws = new WebSocket("wss://streamer.finance.yahoo.com")

            ws.onopen = () => {
                ws.send(JSON.stringify({ subscribe: tickers }))
            }

            ws.onmessage = async (event) => {
                const base64 = typeof event.data === "string"
                    ? event.data
                    : await (event.data as Blob).text()

                const bin = atob(base64)
                const bytes = new Uint8Array(bin.length)
                for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)

                const msg = Yaticker.decode(bytes)
                const obj = Yaticker.toObject(msg, { longs: Number })

                console.log(obj)

                setInfo((prev) => ({
                    ...prev,
                    [obj.id]: obj,
                }))
            }

            ws.onclose = () => console.log("WebSocket closed")
        })

        return () => {
            ws?.close()
        }
    }, [tickers])

    return info
}