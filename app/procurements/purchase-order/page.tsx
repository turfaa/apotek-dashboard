import NewDrugButton from "@/app/procurements/purchase-order/new-drug-button"
import RefreshButton from "@/app/procurements/purchase-order/refresh-button"
import PurchaseOrderTable from "@/app/procurements/purchase-order/table"
import PurchaseOrderTitle from "@/app/procurements/purchase-order/title"
import SearchButton from "@/components/search-button"
import { Card, Col, Flex, Grid } from "@tremor/react"
import moment from "moment/moment"
import { Metadata } from "next"
import { Suspense } from "react"

interface PurchaseOrderProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export async function generateMetadata(
    props: PurchaseOrderProps,
): Promise<Metadata> {
    const { query, print } = props.searchParams

    let title
    if (print === "true") {
        title = {
            absolute: `${moment().format("YYYY-MM-DD")}${query ? ` - ${query}` : ""}`,
        }
    } else {
        title = "Daftar Pesanan"
    }

    return {
        title: title,
        description: "Daftar pesanan obat",
    }
}

export default function PurchaseOrder() {
    return (
        <main className="p-4 md:p-10 mx-auto">
            <Flex className="pb-4">
                <Suspense>
                    <PurchaseOrderTitle />
                </Suspense>
            </Flex>

            <Grid numItemsSm={1} numItemsMd={2} className="gap-4">
                <Col>
                    <Suspense>
                        <SearchButton />
                    </Suspense>
                </Col>

                <Col className="justify-self-end flex gap-4">
                    <Suspense>
                        <NewDrugButton />
                        <RefreshButton />
                    </Suspense>
                </Col>
            </Grid>

            <Card className="mt-4">
                <Suspense>
                    <PurchaseOrderTable />
                </Suspense>
            </Card>
        </main>
    )
}
