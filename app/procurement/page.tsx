import {Card, Col, Flex, Grid} from "@tremor/react"
import SearchButton from "@/shared-components/search-button"
import RefreshButton from "@/app/procurement/refresh-button"
import ProcurementTable from "@/app/procurement/table"
import NewDrugButton from "@/app/procurement/new-drug-button"
import ProcurementTitle from "@/app/procurement/title"
import {Metadata} from "next"
import moment from "moment/moment"

interface ProcurementProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export async function generateMetadata(props: ProcurementProps): Promise<Metadata> {
    const {q, print} = props.searchParams

    let title
    if (print === "true") {
        title = `${moment().format("YYYY-MM-DD")}${q ? ` - ${q}` : ""}`
    } else {
        title = "Daftar Pesanan Obat"
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
                <ProcurementTitle/>
            </Flex>

            <Grid numItemsSm={1} numItemsMd={2} className="gap-4">
                <Col>
                    <SearchButton/>
                </Col>

                <Col className="justify-self-end flex gap-4">
                    <NewDrugButton/>
                    <RefreshButton/>
                </Col>
            </Grid>

            <Card className="mt-4">
                <ProcurementTable/>
            </Card>
        </main>
    )
}