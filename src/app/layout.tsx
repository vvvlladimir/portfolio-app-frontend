import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css";
import {Providers, TickerProvider} from "./providers"
import {SidebarInset, SidebarProvider} from "@/shared/components/ui/sidebar"
import { AppSidebar } from "@/shared/components/widgets/app-sidebar"
import {Card} from "@/shared/components/ui/card";

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
}: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <Providers>
                        <TickerProvider>{children}</TickerProvider>
                    </Providers>
                </SidebarInset>
            </SidebarProvider>
            </body>
        </html>
    )
}

