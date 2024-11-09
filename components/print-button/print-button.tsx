"use client"

import { usePrintMode } from "@/lib/print-mode"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "@radix-ui/react-icons"

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
            <DownloadIcon className="mr-2 h-4 w-4" />
            Print
        </Button>
    )
}
