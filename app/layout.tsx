import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Providers } from "./providers" // 👈 Importa el wrapper de contexto

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
