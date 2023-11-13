import NewDrugButton from "@/app/procurement/new-drug-button"
import RefreshButton from "@/app/procurement/refresh-button"
import ProcurementTable from "@/app/procurement/table"
import ProcurementTitle from "@/app/procurement/title"
import SearchButton from "@/shared-components/search-button"
import { Card, Col, Flex, Grid } from "@tremor/react"
import moment from "moment/moment"
import { Metadata } from "next"
import { Suspense } from "react"

interface ProcurementProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export async function generateMetadata(props: ProcurementProps): Promise<Metadata> {
    const { query, print } = props.searchParams

    let title
    if (print === "true") {
        title = {
            absolute: `${moment().format("YYYY-MM-DD")}${query ? ` - ${query}` : ""}`
        }
    } else {
        title = "Daftar Pesanan"
    }

    return {
        title: title,
        description: "Daftar pesanan obat",
    }
}

export default function Procurement() {
    return (
        <main className="p-4 md:p-10 mx-auto">
            <Flex className="pb-4">
                <Suspense>
                    <ProcurementTitle />
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
                    <ProcurementTable />
                </Suspense>
            </Card>
        </main>
    )
}