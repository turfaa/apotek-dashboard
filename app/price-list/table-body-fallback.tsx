import {TableBody, TableCell, TableRow, Text} from "@tremor/react"

export default function PriceListTableBodyFallback(): React.ReactElement {
    return (
        <TableBody>
            <TableRow><TableCell><Text>Tunggu sebentar...</Text></TableCell></TableRow>
        </TableBody>
    )
}