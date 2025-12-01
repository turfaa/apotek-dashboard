"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { RupiahFormat } from "./rupiah"

interface RupiahFormatContextType {
    format: RupiahFormat
    setFormat: (format: RupiahFormat) => void
    toggleFormat: () => void
}

const RupiahFormatContext = createContext<RupiahFormatContextType | undefined>(undefined)

export function RupiahFormatProvider({ children }: { children: React.ReactNode }) {
    const [format, setFormat] = useState<RupiahFormat>("indonesian")
    
    const toggleFormat = useCallback(() => {
        setFormat((prev) => (prev === "indonesian" ? "us" : "indonesian"))
    }, [])
    
    return (
        <RupiahFormatContext.Provider value={{ format, setFormat, toggleFormat }}>
            {children}
        </RupiahFormatContext.Provider>
    )
}

export function useRupiahFormat() {
    const context = useContext(RupiahFormatContext)
    if (context === undefined) {
        throw new Error("useRupiahFormat must be used within a RupiahFormatProvider")
    }
    return context
}

