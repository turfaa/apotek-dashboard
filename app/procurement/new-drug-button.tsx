"use client"

import { useProcurementRecommendations } from "@/lib/api/hooks"
import { Procurement } from "@/lib/api/procurement-recommendation"
import { usePrintMode } from "@/lib/print-mode"
import useSearch from "@/lib/search-hook"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Button } from "@tremor/react"

export default function NewDrugButton(): React.ReactElement {
    const { isLoading, setData } = useProcurementRecommendations()
    const { query } = useSearch()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Button
            variant="secondary"
            icon={PlusIcon}
            disabled={isLoading}
            onClick={() => {
                const newData = newProcurement(query)
                setData(newData.drug.vmedisCode, newData)
            }}
        >
            Tambah Obat
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
            units: [],
            stocks: [],
        },
        stock: "",
        alternatives: [],
        procurement: "",
        fromSupplier: query,
    }
}
