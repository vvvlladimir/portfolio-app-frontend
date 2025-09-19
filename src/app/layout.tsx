import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css";
import { Providers } from "./providers"

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-inter",
})

const jetbrains = JetBrains_Mono({
    subsets: ["latin", "cyrillic"],
    variable: "--font-jetbrains",
})

export const metadata: Metadata = {
    title: "Portfolio App",
    description: "Manage and track your investment portfolio",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
                <main className="container mx-auto px-4">
                    <Providers>{children}</Providers>
                </main>
            </body>
        </html>
    )
}

