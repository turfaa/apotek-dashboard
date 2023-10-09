import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React, {Suspense} from "react"
import NavbarFallback from "@/app/navbar-fallback"
import Navbar from "@/app/navbar"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Dashboard Apotek Aulia Farma',
    description: 'Dashboard Apotek Aulia Farma.',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full bg-gray-50">
        <body className={inter.className}>
        <Suspense fallback={<NavbarFallback/>}>
            <Navbar/>
        </Suspense>
        {children}
        </body>
        </html>
    )
}