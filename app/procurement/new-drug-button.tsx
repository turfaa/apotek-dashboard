"use client"

import {Procurement} from "@/lib/api/procurement-recommendation"
import {Button} from "@tremor/react"
import {PlusIcon} from "@heroicons/react/24/outline"
import {useProcurementRecommendations} from "@/lib/api/hooks"
import useSearch from "@/app/procurement/search-hook"
import {usePrintMode} from "@/lib/print-mode"

export default function NewDrugButton(): React.ReactElement {
    const {isLoading, setData} = useProcurementRecommendations()
    const {query} = useSearch()
    const {isPrintMode} = usePrintMode()

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
        },
        stock: "",
        alternatives: [],
        procurement: "",
        fromSupplier: query,
    }
}