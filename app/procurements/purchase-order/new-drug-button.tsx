"use client"

import { usePurchaseOrders } from "@/lib/api/hooks"
import { ProcurementRecommendation } from "@/lib/api/procurement-recommendation"
import { usePrintMode } from "@/lib/print-mode"
import useSearch from "@/lib/search-hook"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

export default function NewDrugButton(): React.ReactElement {
    const { isLoading, setData } = usePurchaseOrders()
    const { query } = useSearch()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => {
                const newData = newProcurement(query)
                setData(newData.drug.vmedisCode, newData)
            }}
        >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tambah Obat
        </Button>
    )
}

function newProcurement(query: string): ProcurementRecommendation {
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
