import { Card, Col, Grid, Text, Title } from "@tremor/react"
import { Suspense } from "react"
import SearchButtonFallback from "@/shared-components/search-button-fallback"
import SearchButton from "@/shared-components/search-button"
import PriceListTableFallback from "@/app/price-list/v2/table-fallback"
import PriceListTable from "@/app/price-list/v2/table"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Daftar Harga",
}

export default function PriceList(): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Daftar Harga Obat</Title>

            <Grid numItemsSm={1} numItemsMd={2} className="gap-4">
                <Col>
                    <Suspense fallback={<SearchButtonFallback />}>
                        <SearchButton />
                    </Suspense>
                </Col>

                <Col className="justify-self-end">
                    <Text>
                        Hubungi{" "}
                        <a href="https://wa.me/6281223556554" target="_blank">
                            081223556554
                        </a>{" "}
                        untuk mendapatkan harga partai/medis.
                    </Text>
                </Col>
            </Grid>

            <Card className="mt-4">
                <Suspense fallback={<PriceListTableFallback />}>
                    <PriceListTable />
                </Suspense>
            </Card>
        </main>
    )
}
