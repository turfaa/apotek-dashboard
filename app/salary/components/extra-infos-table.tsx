import { SalaryExtraInfo } from "@/lib/api/salary"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ExtraInfosTableProps {
    extraInfos: SalaryExtraInfo[]
    onDelete: (extraInfo: SalaryExtraInfo) => void
    emptyMessage?: string
}

export function ExtraInfosTable({ 
    extraInfos, 
    onDelete,
    emptyMessage = "Belum ada informasi tambahan untuk karyawan ini"
}: ExtraInfosTableProps): React.ReactElement {
    if (extraInfos.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                {emptyMessage}
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {extraInfos.map((extraInfo) => (
                    <TableRow key={extraInfo.id}>
                        <TableCell className="font-medium">
                            {extraInfo.title}
                        </TableCell>
                        <TableCell>
                            {extraInfo.description}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(extraInfo)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
