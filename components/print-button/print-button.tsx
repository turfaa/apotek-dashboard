"use client"

import { usePrintMode } from "@/lib/print-mode"
import { PrinterIcon } from "@heroicons/react/24/solid"
import { Button } from "@tremor/react"

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
            icon={PrinterIcon}
            color={isPrintMode ? "red" : "blue"}
            disabled={disabled}
            onClick={() => setPrintMode(true)}
        >
            Print
        </Button>
    )
}
