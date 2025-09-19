// "use client"

import { useEffect, useState } from "react"
import * as protobuf from "protobufjs"
//
// function chunkArray<T>(arr: T[], size: number): T[][] {
//     return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
//         arr.slice(i * size, i * size + size)
//     )
// }
//
// export function useTickerWebSocket(tickers: string[], chunkSize = 5) {
//     const [info, setInfo] = useState<Record<string, LiveTicker>>({})
//
//     useEffect(() => {
//         if (!tickers.length) return
//         const chunks = chunkArray(tickers, chunkSize)
//
//         console.log(chunks)
//         const sockets: WebSocket[] = []
//         let Yaticker: protobuf.Type
//
//         protobuf.load("/yaticker.proto").then((root) => {
//             Yaticker = root.lookupType("yaticker")
//
//             chunks.forEach((chunk) => {
//                 const ws = new WebSocket("wss://streamer.finance.yahoo.com")
//                 sockets.push(ws)
//
//                 ws.onopen = () => {
//                     ws.send(JSON.stringify({ subscribe: chunk }))
//                 }
//
//                 ws.onmessage = async (event) => {
//                     const base64 = typeof event.data === "string"
//                         ? event.data
//                         : await (event.data as Blob).text()
//
//                     const bin = atob(base64)
//                     const bytes = new Uint8Array(bin.length)
//                     for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
//
//                     const msg = Yaticker.decode(bytes)
//                     const obj = Yaticker.toObject(msg, { longs: Number })
//
//                     console.log(obj)
//
//                     setInfo((prev) => ({
//                         ...prev,
//                         [obj.id]: obj
//                     }))
//                 }
//
//                 ws.onclose = () => console.log("WebSocket closed for", chunk)
//             })
//         })
//
//         return () => {
//             sockets.forEach((ws) => ws.close())
//         }
//     }, [tickers, chunkSize])
//
//     return info
// }