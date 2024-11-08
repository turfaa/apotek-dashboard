import Loading from "@/components/loading"
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@/components/ui/table"
import { ReloadIcon } from "@radix-ui/react-icons"

export default function PriceListTableFallback(): React.ReactElement {
    return (
        <Table>
            <PriceListTableBodyFallback />
        </Table>
    )
}

export function PriceListTableBodyFallback(): React.ReactElement {
    return (
        <TableBody>
            <TableRow>
                <TableCell>
                    <Loading />
                </TableCell>
            </TableRow>
        </TableBody>
    )
}
