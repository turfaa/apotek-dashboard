import Loading from "@/components/loading"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

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
