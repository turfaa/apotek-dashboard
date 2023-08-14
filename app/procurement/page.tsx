import {Card, Col, Flex, Grid, Title} from "@tremor/react"
import Search from "@/app/procurement/search"
import RefreshButton from "@/app/procurement/refresh-button"
import ProcurementTable from "@/app/procurement/table"
import NewDrugButton from "@/app/procurement/new-drug-button"
import PrintButton from "@/app/procurement/print-button";

export default function Procurement() {
    return (
        <main className="p-4 md:p-10 mx-auto">
            <Flex className="pb-4">
                <Title>Pesanan Apotek Aulia Farma ({new Date().toLocaleDateString("id-ID")})</Title>
                <PrintButton/>
            </Flex>

            <Grid numItemsSm={1} numItemsMd={2} className="gap-4">
                <Col>
                    <Search/>
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