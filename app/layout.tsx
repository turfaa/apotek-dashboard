import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React, {Suspense} from "react"
import NavbarFallback from "@/app/navbar-fallback"
import Nav from "@/app/nav"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: {
        default: 'Apotek Aulia Farma',
        template: '%s | Apotek Aulia Farma',
    },
    description: 'Website Apotek Aulia Farma.',
    applicationName: 'Apotek Aulia Farma',
    generator: 'Next.js',
    authors: [{name: 'Turfa Auliarachman', url: 'https://github.com/turfaa'}],
    creator: 'Turfa Auliarachman',
    publisher: 'Turfa Auliarachman',
    formatDetection: {
        telephone: true,
        date: true,
        address: true,
        email: true,
        url: true,
    },
    metadataBase: new URL('https://auliafarma.co.id'),
    twitter: {
        card: 'summary_large_image',
        title: 'Apotek Aulia Farma',
        description: 'Website untuk Apotek Aulia Farma.',
        site: '@turfaul',
        creator: '@turfaul',
        images: ['/icon.png'],
    },
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className="h-full bg-gray-50">
        <body className={inter.className}>
        <Suspense fallback={<NavbarFallback/>}>
            <Nav/>
        </Suspense>
        {children}
        </body>
        </html>
    )
}