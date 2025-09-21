"use client"

import { SalaryStaticComponent } from "@/lib/api/salary"
import { rupiah } from "@/lib/rupiah"
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

interface StaticComponentsTableProps {
    components: SalaryStaticComponent[]
    onDelete: (component: SalaryStaticComponent) => void
}

export function StaticComponentsTable({ 
    components, 
    onDelete 
}: StaticComponentsTableProps): React.ReactElement {
    if (components.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-8">
                Belum ada komponen gaji statis untuk karyawan ini
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="text-right">Fee / (Penalti)</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {components.map((component) => (
                    <TableRow key={component.id}>
                        <TableCell className="font-medium">
                            {component.description}
                        </TableCell>
                        <TableCell className="text-right">
                            {component.multiplier.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-right">
                            {rupiah.format(component.amount)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                            {rupiah.format(component.total)}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(component)}
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
