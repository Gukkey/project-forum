import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"

import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { InviteProvider } from "@projectforum/context/invite"

const inter = Inter({ subsets: ["latin"] })
const montserrat = Montserrat({ subsets: ["latin-ext"] })

export const metadata: Metadata = {
  title: "forum.",
  description: "a place to discuss your niche"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorBackground: "hsl(223 47% 11%)",
            colorInputBackground: "hsl(216 34% 17%)"
          }
        }}
      >
        <InviteProvider>
          <body className={`${inter.className} ${montserrat.className}`}>{children}</body>
        </InviteProvider>
      </ClerkProvider>
    </html>
  )
}
