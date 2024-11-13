"use client"

import { usePrintMode } from "@/lib/print-mode"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export interface PrintButtonProps {
    disabled?: boolean
}

export function PrintButton({
    disabled,
}: PrintButtonProps): React.ReactElement {
    const { isPrintMode, setPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Button
            disabled={disabled || isPrintMode}
            onClick={() => setPrintMode(true)}
        >
            <Printer className="mr-2 h-4 w-4" />
            Print
        </Button>
    )
}
