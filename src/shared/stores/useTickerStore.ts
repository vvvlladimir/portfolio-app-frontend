import { create } from "zustand"
import * as protobuf from "protobufjs"

export type LiveTicker = {
    id: string
    price: number
    time: number
    changePercent: number
    change: number
    currency?: string
    exchange?: string
}


type TickerStore = {
    liveData: Record<string, LiveTicker>
    connect: (tickers: string[], chunkSize?: number) => void
    disconnect: () => void
}

function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    )
}

export const useTickerStore = create<TickerStore>((set) => {
    let sockets: WebSocket[] = []
    let Yaticker: protobuf.Type | null = null

    const initProto = async () => {
        if (!Yaticker) {
            const root = await protobuf.load("/yaticker.proto")
            Yaticker = root.lookupType("yaticker")
        }
    }

    return {
        liveData: {},

        connect: async (tickers: string[], chunkSize = 5) => {
            await initProto()
            if (!Yaticker) return

            sockets.forEach((ws) => ws.close())
            sockets = []

            const chunks = chunkArray(tickers, chunkSize)
            console.log("Subscribing in chunks:", chunks)

            chunks.forEach((chunk) => {
                const ws = new WebSocket("wss://streamer.finance.yahoo.com")
                sockets.push(ws)

                ws.onopen = () => {
                    ws.send(JSON.stringify({ subscribe: chunk }))
                }

                ws.onmessage = async (event) => {
                    const base64 = typeof event.data === "string"
                        ? event.data
                        : await (event.data as Blob).text()

                    const bin = atob(base64)
                    const bytes = new Uint8Array(bin.length)
                    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)

                    if (!Yaticker) return
                    const msg = Yaticker.decode(bytes)
                    const obj = Yaticker.toObject(msg, { longs: Number })

                    console.log(obj)


                    set((state) => {
                        return {
                            liveData: {
                                ...state.liveData,
                                [obj.id]: obj,
                            },
                        }
                    })
                }

                ws.onclose = () => console.log("WebSocket closed for", chunk)
            })
        },

        disconnect: () => {
            sockets.forEach((ws) => ws.close())
            sockets = []
            set({ liveData: {} })
        },
    }
})

export const useTickerData = (ticker: string) =>
    useTickerStore((state) => state.liveData[ticker])
