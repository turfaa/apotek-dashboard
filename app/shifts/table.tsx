import React, { use } from "react"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getShifts } from "@/lib/api/shift"
import { SearchParams } from "@/types/search-params"
import Loading from "@/components/loading"


export interface ShiftsTableProps {
    searchParams: SearchParams
}

export default function ShiftsTable(props: ShiftsTableProps): React.ReactElement {
    const session = use(auth())
    const searchParams = use(props.searchParams)
    const data = use(getShifts(searchParams.from, searchParams.until, session))

    return <Table table={data} />
}

export function ShiftsTableFallback(): React.ReactElement {
    return (
        <Table
            table={{
                header: ["Kode", "Kasir", "Mulai", "Selesai", "Kas Awal", "Kas Akhir Seharusnya", "Kas Akhir Sebenarnya", "Selisih", "Catatan"],
                rows: [{ id: "0", columns: [<Loading key="0" />] }],
            }}
        />
    )
}
