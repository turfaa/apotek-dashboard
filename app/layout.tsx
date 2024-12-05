import "@/app/globals.css"
import Nav from "@/app/nav"
import NavbarFallback from "@/app/navbar-fallback"
import { GeistSans } from "geist/font/sans"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata, Viewport } from "next"
import React, { Suspense } from "react"

// export const fetchCache = 'default-cache'

export const metadata: Metadata = {
    title: {
        default: "Apotek Aulia Farma",
        template: "%s | Apotek Aulia Farma",
    },
    description: "Website Apotek Aulia Farma.",
    applicationName: "Apotek Aulia Farma",
    generator: "Next.js",
    authors: [{ name: "Turfa Auliarachman", url: "https://github.com/turfaa" }],
    creator: "Turfa Auliarachman",
    publisher: "Turfa Auliarachman",
    formatDetection: {
        telephone: true,
        date: true,
        address: true,
        email: true,
        url: true,
    },
    metadataBase: new URL("https://auliafarma.co.id"),
    manifest: "/manifest.json",
    twitter: {
        card: "summary_large_image",
        title: "Apotek Aulia Farma",
        description: "Website untuk Apotek Aulia Farma.",
        site: "@turfaul",
        creator: "@turfaul",
        images: ["/icon.png"],
    },
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#ffffff",
}


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full">
            <body className={GeistSans.className}>
                <Suspense fallback={<NavbarFallback />}>
                    <Nav />
                </Suspense>

                {children}
                <Toaster />
            </body>
        </html>
    )
}
