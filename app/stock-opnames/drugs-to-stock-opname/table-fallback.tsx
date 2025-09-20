import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

export default function DrugsToStockOpnameTableFallback(): React.ReactElement {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Stok Sistem</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableHead>{index + 1}</TableHead>
                        <TableCell>
                            <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
