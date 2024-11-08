import { Table, TableBody, TableCell, TableRow } from "@tremor/react"
import { Text } from "@/components/typography"

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
                    <Text>Tunggu sebentar...</Text>
                </TableCell>
            </TableRow>
        </TableBody>
    )
}
