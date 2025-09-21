import { Salary } from "@/lib/api/salary"
import { rupiah } from "@/lib/rupiah"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface SalaryCardProps {
    salary: Salary
    employeeName: string
    monthDisplay: string
}

export function SalaryCard({ salary, employeeName, monthDisplay }: SalaryCardProps): React.ReactElement {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Gaji {employeeName} - {monthDisplay}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Komponen</TableHead>
                                <TableHead className="text-right">Jumlah</TableHead>
                                <TableHead className="text-right">
                                    Fee / (Penalti)
                                </TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {salary.components.map((component, index) => (
                                <TableRow key={index}>
                                    <TableCell>{component.description}</TableCell>
                                    <TableCell className="text-right">
                                        {component.multiplier.toLocaleString("id-ID")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {rupiah.format(component.amount)}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        {rupiah.format(component.total)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="border-t pt-4 space-y-4">
                        {salary.totalWithoutDebt !== salary.total && (
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Gaji (Tanpa Utang):</span>
                                <span className="text-lg font-bold">
                                    {rupiah.format(salary.totalWithoutDebt)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Gaji:</span>
                            <span className="text-lg font-bold">
                                {rupiah.format(salary.total)}
                            </span>
                        </div>
                    </div>

                    {salary.extraInfos.length > 0 && (
                        <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
                            <div className="space-y-3">
                                {salary.extraInfos.map((extraInfo) => (
                                    <div key={extraInfo.id} className="p-4 border rounded-lg bg-muted/50">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium text-sm">{extraInfo.title}</h4>
                                            <p className="text-sm text-muted-foreground">{extraInfo.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
