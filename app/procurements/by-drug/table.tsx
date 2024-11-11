import React, { use } from "react"
import { Text } from "@/components/typography"
import { getLastDrugProcurements } from "@/lib/api/last-drug-procurements"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { SearchParams } from "@/types/search-params"

const DEFAULT_DRUG_PROCUREMENTS_LIMIT = 5

export interface LastDrugProcurementsTableProps {
    searchParams: SearchParams
}

export default function LastDrugProcurementsTable({
    searchParams,
}: LastDrugProcurementsTableProps): React.ReactElement {
    const { "drug-code": drugCode, limit } = use(searchParams)

    if (!drugCode) {
        return <Text>Silakan pilih obat terlebih dahulu</Text>
    }

    let limitNumber = DEFAULT_DRUG_PROCUREMENTS_LIMIT
    if (limit) {
        limitNumber = parseInt(limit)
        if (isNaN(limitNumber)) {
            limitNumber = DEFAULT_DRUG_PROCUREMENTS_LIMIT
        }
    }

    const session = use(auth())
    const data = use(getLastDrugProcurements(
        drugCode,
        limitNumber,
        session,
    ))

    return <Table table={data} />
}

export function LastDrugProcurementsTableFallback(): React.ReactElement {
    return (
        <Table
            table={{
                header: ["Tanggal Diinput", "Nomor Faktur", "Tanggal Faktur", "Jumlah", "Harga Satuan", "Supplier"],
                rows: [{ id: "0", columns: ["Mohon tunggu..."] }],
            }}
        />
    )
}
