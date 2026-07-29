import React, { Suspense } from "react"
import { Metadata } from "next"
import { Title, Subtitle } from "@/components/typography/v2"
import DateRangePicker from "@/components/date-range-picker"
import { SearchParams } from "@/types/search-params"
import SupplierProcurementRecapsTable, {
    SupplierProcurementRecapsTableFallback,
} from "./table"

export const metadata: Metadata = {
    title: "Rekap Pembelian per Supplier",
    description: "Total pembelian per supplier berdasarkan tanggal faktur",
}

export default function SupplierProcurementRecaps(props: {
    searchParams: SearchParams
}): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-col gap-2 mb-6">
                <Title>Rekap Pembelian per Supplier</Title>
                <Subtitle>
                    Total pembelian per supplier berdasarkan tanggal faktur,
                    diurutkan dari yang terbesar.
                </Subtitle>
                <DateRangePicker />
            </div>

            <div className="rounded-md border">
                <Suspense fallback={<SupplierProcurementRecapsTableFallback />}>
                    <SupplierProcurementRecapsTable
                        searchParams={props.searchParams}
                    />
                </Suspense>
            </div>
        </main>
    )
}
