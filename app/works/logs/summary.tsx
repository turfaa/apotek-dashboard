import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { WorkLog } from "@/lib/api/work"
import { Skeleton } from "@/components/ui/skeleton"
import { CollapsibleHeader } from "./collapsible-header"
import { Badge } from "@/components/ui/badge"
import { rupiah } from "@/lib/rupiah"

export function WorkLogsSummarySkeleton(): React.ReactElement {
    return (
        <Card className="mb-6">
            <CardHeader className="p-4 py-0">
                <CollapsibleHeader>
                    <Skeleton className="h-9 w-9" />
                </CollapsibleHeader>
            </CardHeader>
        </Card>
    )
}

interface WorkLogsSummaryProps {
    workLogsPromise: Promise<WorkLog[]>
}

export async function WorkLogsSummary({
    workLogsPromise,
}: WorkLogsSummaryProps): Promise<React.ReactElement> {
    const logs = await workLogsPromise

    // Group logs by employee
    const summaryByEmployee = logs.reduce(
        (acc, log) => {
            const employeeId = log.employee.id
            if (!acc[employeeId]) {
                acc[employeeId] = {
                    employee: log.employee,
                    totalPatients: 0,
                    workCount: 0,
                    totalMultiplier: 0,
                    workTypes: {} as Record<
                        number,
                        {
                            name: string
                            count: number
                            totalMultiplier: number
                        }
                    >,
                }
            }

            // Count unique patients
            acc[employeeId].totalPatients++

            // Count work units and calculate multipliers
            log.units.forEach((unit) => {
                const workTypeId = unit.workType.id
                if (!acc[employeeId].workTypes[workTypeId]) {
                    acc[employeeId].workTypes[workTypeId] = {
                        name: unit.workType.name,
                        count: 0,
                    }
                }
                // Increment count and add multiplier for each unit
                acc[employeeId].workTypes[workTypeId].count++
                acc[employeeId].workCount++
                acc[employeeId].totalMultiplier += unit.workMultiplier
            })

            return acc
        },
        {} as Record<
            number,
            {
                employee: { id: number; name: string }
                totalPatients: number
                workCount: number
                totalMultiplier: number
                workTypes: Record<
                    number,
                    {
                        name: string
                        count: number
                    }
                >
            }
        >,
    )

    const tableContent = (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">
                            Karyawan
                        </TableHead>
                        <TableHead className="font-semibold">
                            Total Pasien
                        </TableHead>
                        <TableHead className="font-semibold">
                            Total Kompensasi
                        </TableHead>
                        <TableHead className="font-semibold">
                            Rincian Pekerjaan
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.values(summaryByEmployee).map((summary) => (
                        <TableRow key={summary.employee.id}>
                            <TableCell className="font-medium">
                                {summary.employee.name}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className="font-normal"
                                >
                                    {summary.totalPatients} pasien
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className="font-normal"
                                >
                                    {rupiah.format(
                                        summary.totalMultiplier * 1000,
                                    )}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1.5">
                                    {Object.values(summary.workTypes).map(
                                        (workType) => (
                                            <div
                                                key={workType.name}
                                                className="text-sm"
                                            >
                                                <span className="text-muted-foreground">
                                                    {workType.name}:
                                                </span>{" "}
                                                <span>
                                                    {workType.count} kali
                                                </span>
                                            </div>
                                        ),
                                    )}
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">
                                            Total Pekerjaan:
                                        </span>{" "}
                                        <span>{summary.workCount} kali</span>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {Object.keys(summaryByEmployee).length > 0 && (
                        <TableRow className="bg-muted/50 font-medium">
                            <TableCell>Total Keseluruhan</TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className="font-medium"
                                >
                                    {Object.values(summaryByEmployee).reduce(
                                        (sum, summary) =>
                                            sum + summary.totalPatients,
                                        0,
                                    )}{" "}
                                    pasien
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className="font-medium"
                                >
                                    {rupiah.format(
                                        Object.values(summaryByEmployee).reduce(
                                            (sum, summary) =>
                                                sum + summary.totalMultiplier,
                                            0,
                                        ) * 1000,
                                    )}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1.5">
                                    {Object.entries(
                                        Object.values(summaryByEmployee).reduce(
                                            (acc, summary) => {
                                                Object.values(
                                                    summary.workTypes,
                                                ).forEach((workType) => {
                                                    if (!acc[workType.name]) {
                                                        acc[workType.name] = {
                                                            count: 0,
                                                        }
                                                    }
                                                    acc[workType.name].count +=
                                                        workType.count
                                                })
                                                return acc
                                            },
                                            {} as Record<
                                                string,
                                                { count: number }
                                            >,
                                        ),
                                    ).map(([name, total]) => (
                                        <div key={name} className="text-sm">
                                            <span className="text-muted-foreground">
                                                {name}:
                                            </span>{" "}
                                            <span>{total.count} kali</span>
                                        </div>
                                    ))}
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">
                                            Total Pekerjaan:
                                        </span>{" "}
                                        <span>
                                            {Object.values(
                                                summaryByEmployee,
                                            ).reduce(
                                                (sum, summary) =>
                                                    sum + summary.workCount,
                                                0,
                                            )}{" "}
                                            kali
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {Object.keys(summaryByEmployee).length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="h-24 text-center text-muted-foreground"
                            >
                                Tidak ada data.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )

    return (
        <Card className="mb-6">
            <CardHeader className="p-4 py-0">
                <CollapsibleHeader>
                    <CardContent className="px-0 py-4">
                        {tableContent}
                    </CardContent>
                </CollapsibleHeader>
            </CardHeader>
        </Card>
    )
}
