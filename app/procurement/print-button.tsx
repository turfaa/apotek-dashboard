"use client"

import {Procurement} from "@/lib/api"
import {Button} from "@tremor/react"
import {useProcurementRecommendations} from "@/lib/api-hook"
import {usePrintMode} from "@/lib/print-mode"
import {PrinterIcon} from "@heroicons/react/24/solid";

export default function PrintButton(): React.ReactElement {
    const {isLoading, setData} = useProcurementRecommendations()
    const {isPrintMode, setPrintMode} = usePrintMode()

    return (
        <Button
            icon={PrinterIcon}
            color={isPrintMode ? "red" : "blue"}
            disabled={isLoading}
            onClick={() => setPrintMode(!isPrintMode)}
        >
            {isPrintMode && "Keluar "} Print
        </Button>
    )
}

function newProcurement(query: string): Procurement {
    return {
        drug: {
            vmedisCode: Math.random().toString(36).substring(7),
            name: query.length > 0 ? "0 " + query : "",
            manufacturer: "",
            supplier: "",
            minimumStock: "",
        },
        stock: "",
        alternatives: [],
        procurement: "",
        fromSupplier: query,
    }
}