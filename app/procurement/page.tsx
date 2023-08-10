import {Card, Grid, Title} from "@tremor/react"
import Search from "@/app/procurement/search"
import RefreshButton from "@/app/procurement/refresh-button";
import ProcurementTable from "@/app/procurement/table";

export default function Procurement() {
    return (
        <main className="p-4 md:p-10 mx-auto">
            <Title>Pembelian</Title>

            <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                <Search/>
                <RefreshButton/>
            </Grid>

            <Card className="mt-4">
                <ProcurementTable/>
            </Card>
        </main>
    )
}