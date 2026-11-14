import { Metadata } from "next"
import { Suspense } from "react"
import { Subtitle, Title } from "@/components/typography/v2"
import { auth } from "@/lib/auth"
import {
    getPurchaseOrderLetterEmployees,
    getPurchaseOrderLetterOptions,
    listPurchaseOrderLetterCreators,
} from "@/lib/api/purchase-order-letter"
import { getSuppliers } from "@/lib/api/supplier"
import { SearchParams } from "@/types/search-params"
import { HistoryFilters, HistoryFiltersFallback } from "./filters"
import HistoryTable, { HistoryTableFallback } from "./table"

export const metadata: Metadata = {
    title: "Riwayat Surat Pesanan",
    description: "Semua surat pesanan yang dibuat dari halaman Buat Pesanan",
}

export interface PurchaseOrderLettersPageProps {
    searchParams: SearchParams
}

export default function PurchaseOrderLettersPage(
    props: PurchaseOrderLettersPageProps,
): React.ReactElement {
    const sessionPromise = auth()

    // Filter options degrade to empty lists, so a failure here never hides
    // the list itself.
    const suppliersPromise = sessionPromise
        .then((session) => getSuppliers(session))
        .then((res) =>
            res.suppliers.map(({ vmedisId, name }) => ({ vmedisId, name })),
        )
        .catch(() => [])
    const optionsPromise = sessionPromise
        .then((session) => getPurchaseOrderLetterOptions(session))
        .catch(() => null)
    const creatorsPromise = sessionPromise
        .then((session) => listPurchaseOrderLetterCreators(session))
        .catch(() => [])
    // For Dibuat oleh in the Duplikat dialog. Null when HRIS can't be read.
    const employeesPromise = sessionPromise
        .then((session) => getPurchaseOrderLetterEmployees(session))
        .catch((error: unknown) => {
            console.error("Failed to load employees from HRIS", error)
            return null
        })

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-6">
                <Title>Riwayat Surat Pesanan</Title>
                <Subtitle>
                    Semua surat pesanan yang dibuat dari halaman Buat Pesanan.
                </Subtitle>
            </div>

            <Suspense fallback={<HistoryFiltersFallback />}>
                <HistoryFilters
                    suppliersPromise={suppliersPromise}
                    optionsPromise={optionsPromise}
                    creatorsPromise={creatorsPromise}
                />
            </Suspense>

            <Suspense fallback={<HistoryTableFallback />}>
                <HistoryTable
                    searchParams={props.searchParams}
                    sessionPromise={sessionPromise}
                    optionsPromise={optionsPromise}
                    employeesPromise={employeesPromise}
                />
            </Suspense>
        </main>
    )
}
