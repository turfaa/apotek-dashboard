import {Card, Col, Grid, Text, Title} from "@tremor/react"
import {getDrugs} from "@/lib/api/drug"
import PriceListTable from "@/app/price-list/table"
import SearchButton from "@/shared-components/search-button"

export default async function PriceList(): Promise<React.ReactElement> {
    const {drugs} = await getDrugs()

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Daftar Harga Obat</Title>

            <Grid numItemsSm={1} numItemsMd={2} className="gap-4">
                <Col>
                    <SearchButton/>
                </Col>

                <Col className="justify-self-end">
                    <Text>
                        Hubungi <a href="https://wa.me/6281223556554" target="_blank">081223556554</a> untuk mendapatkan
                        harga partai/medis.
                    </Text>
                </Col>
            </Grid>

            <Card className="mt-4">
                <PriceListTable rows={drugs}/>
            </Card>
        </main>
    )
}