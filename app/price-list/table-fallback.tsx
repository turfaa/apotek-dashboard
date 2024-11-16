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
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Loading />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}