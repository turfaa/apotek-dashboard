import React from "react"
import Link from "next/link"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getShifts } from "@/lib/api/shift"
import { SearchParams } from "@/types/search-params"
import Loading from "@/components/loading"
import { PrinterIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tooltip } from "@/components/ui/tooltip"

export interface ShiftsTableProps {
    searchParams: SearchParams
}

export default async function ShiftsTable(props: ShiftsTableProps): Promise<React.ReactElement> {
    const data = await Promise.all([auth(), props.searchParams]).
        then(([session, { from, until }]) => getShifts(from, until, session))

    return (
        <Table
            table={data}
            rowActions={[
                (id) => (
                    <Link href={`/api/shifts/${id}/show`} target="_blank" key={id}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <PrinterIcon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Print</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </Link>
                ),
            ]}
        />
    )
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
