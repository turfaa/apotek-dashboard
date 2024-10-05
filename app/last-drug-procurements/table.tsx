import React from "react"
import { Text } from "@tremor/react"
import { getLastDrugProcurements } from "@/lib/api/last-drug-procurements"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"

const LAST_DRUG_PROCUREMENTS_LIMIT = 5

export interface LastDrugProcurementsTableProps {
    drugCode?: string
}

export default async function LastDrugProcurementsTable({
    drugCode,
}: LastDrugProcurementsTableProps): Promise<React.ReactElement> {
    if (!drugCode) {
        return <Text>Silahkan pilih obat terlebih dahulu</Text>
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    const session = await auth()
    const data = await getLastDrugProcurements(
        drugCode,
        LAST_DRUG_PROCUREMENTS_LIMIT,
        session,
    )

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
