"use client"

import React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRupiahFormat } from "@/lib/rupiah-format-context"

export function RupiahFormatToggle(): React.ReactElement {
    const { format, toggleFormat } = useRupiahFormat()
    
    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="rupiah-format-toggle" className="text-sm font-normal cursor-pointer">
                Format: {format === "indonesian" ? "Rp1.000.000,00" : "Rp1,000,000"}
            </Label>
            <Switch
                id="rupiah-format-toggle"
                checked={format === "us"}
                onCheckedChange={() => toggleFormat()}
            />
        </div>
    )
}

