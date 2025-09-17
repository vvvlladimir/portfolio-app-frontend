'use client';

import { useEffect, useState } from 'react';
import * as protobuf from 'protobufjs';


export default function YahooDemo() {
    const [price, setPrice] = useState<number | null>(null);

    useEffect(() => {
        let Yaticker: protobuf.Type;

        protobuf.load('/yaticker.proto').then((root) => {
            Yaticker = root.lookupType('yaticker');

            const ws = new WebSocket('wss://streamer.finance.yahoo.com1');

            ws.onopen = () => {
                ws.send(JSON.stringify({ subscribe: ['AAPL', 'TSLA', 'BTC-USD'] }));
            }

            ws.onmessage = async (event) => {
                const base64 = typeof event.data === 'string'
                    ? event.data
                    : await (event.data as Blob).text();

                // base64 -> Uint8Array
                const bin = atob(base64);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);


                const msg = Yaticker.decode(bytes);
                const obj = Yaticker.toObject(msg, { longs: Number });

                console.log(obj);
            };

            ws.onclose = () => console.log('WebSocket закрыт');
        });
    }, []);

    return (
        <main style={{ padding: 20 }}>
            <h1>Цена AAPL в реальном времени</h1>
            <div style={{ fontSize: 24 }}>
                {price === null ? 'Ждём…' : `$${price.toFixed(2)}`}
            </div>
        </main>
    );
}