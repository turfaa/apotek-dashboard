import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React from "react"
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
        <Navbar/>
        {children}
        </body>
        </html>
    )
}