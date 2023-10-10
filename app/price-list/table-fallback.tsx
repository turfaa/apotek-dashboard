import {Table} from "@tremor/react"
import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"

export default function PriceListTableFallback(): React.ReactElement {
    return (
        <Table>
            <PriceListTableBodyFallback/>
        </Table>
    )
}