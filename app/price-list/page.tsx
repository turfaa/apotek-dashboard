import { Card } from "@/components/ui/card"
import { Title, Text } from "@/components/typography"
import { Suspense } from "react"
import { SearchButtonFallback } from "@/components/search-button"
import SearchButton from "@/components/search-button"
import PriceListTableFallback from "./table-fallback"
import PriceListTable from "./table"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
    title: "Daftar Harga",
}

export default function PriceList(): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Daftar Harga Obat</Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Suspense fallback={<SearchButtonFallback />}>
                        <SearchButton />
                    </Suspense>
                </div>

                <div className="justify-self-end">
                    <Text>
                        Hubungi{" "}
                        <Link href="https://wa.me/6281223556554" target="_blank">
                            081223556554
                        </Link>{" "}
                        untuk mendapatkan harga partai/medis.
                    </Text>
                </div>
            </div>

            <Card className="mt-4 p-6">
                <Suspense fallback={<PriceListTableFallback />}>
                    <PriceListTable />
                </Suspense>
            </Card>
        </main>
    )
}
