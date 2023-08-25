"use client"

import {Button} from "@tremor/react"
import {useProcurementRecommendations} from "@/lib/api-hook"
import {usePrintMode} from "@/lib/print-mode"
import {PrinterIcon} from "@heroicons/react/24/solid"

export default function PrintButton(): React.ReactElement {
    const {isLoading} = useProcurementRecommendations()
    const {isPrintMode, setPrintMode} = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Button
            icon={PrinterIcon}
            color={isPrintMode ? "red" : "blue"}
            disabled={isLoading}
            onClick={() => setPrintMode(true)}
        >
            Print
        </Button>
    )
}
