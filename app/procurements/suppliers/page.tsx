import { Subtitle, Title } from "@/components/typography/v2"
import SearchButton, { SearchButtonFallback } from "@/components/search-button"
import { getSuppliers } from "@/lib/api/supplier"
import { auth } from "@/lib/auth"
import { Metadata } from "next"
import { Suspense } from "react"
import SyncButton from "./sync-button"
import SyncingAlert from "./syncing-alert"
import SuppliersTable, { SuppliersTableFallback } from "./table"

export const metadata: Metadata = {
    title: "Daftar Supplier",
}

export default function SuppliersPage(): React.ReactElement {
    const suppliersPromise = auth()
        .then((session) => getSuppliers(session))
        .then((response) => response.suppliers)

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <Title>Daftar Supplier</Title>
                    <Subtitle>
                        Daftar supplier dari Vmedis. Tekan Sinkronkan untuk
                        mengambil data terbaru.
                    </Subtitle>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <Suspense fallback={<SearchButtonFallback />}>
                        <SearchButton
                            className="w-full sm:w-[300px]"
                            placeholder="Cari nama, alamat, atau telepon..."
                        />
                    </Suspense>
                    <SyncButton />
                </div>
            </div>

            <SyncingAlert />

            <div className="rounded-md border mt-4">
                <Suspense fallback={<SuppliersTableFallback />}>
                    <SuppliersTable suppliersPromise={suppliersPromise} />
                </Suspense>
            </div>
        </main>
    )
}
