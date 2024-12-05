import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWorkLogs } from "@/lib/api/work"
import { SearchParams } from "@/types/search-params"
import { use } from "react"
import { Session } from "next-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { CollapsibleHeader } from "./collapsible-header"
import { Badge } from "@/components/ui/badge"

export function WorkLogsSummarySkeleton(): React.ReactElement {
    return (
        <Card className="mb-6">
            <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                    <CardTitle>Ringkasan Pekerjaan</CardTitle>
                    <Skeleton className="h-9 w-9" />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Karyawan</TableHead>
                                <TableHead>Total Pasien</TableHead>
                                <TableHead>Total Pekerjaan</TableHead>
                                <TableHead>Rincian Pekerjaan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-32" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-16" />
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-48" />
                                            <Skeleton className="h-4 w-40" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

interface WorkLogsSummaryProps {
    searchParams: SearchParams
    sessionPromise: Promise<Session | null>
}

export function WorkLogsSummary({ searchParams, sessionPromise }: WorkLogsSummaryProps): React.ReactElement {
    const workLogs = 
        Promise.all([sessionPromise, searchParams])
            .then(([session, searchParams]) => getWorkLogs(searchParams.from, searchParams.until, session))

    const logs = use(workLogs)

    // Group logs by employee
    const summaryByEmployee = logs.reduce((acc, log) => {
        const employeeId = log.employee.id
        if (!acc[employeeId]) {
            acc[employeeId] = {
                employee: log.employee,
                totalPatients: 0,
                totalMultiplier: 0,
                workTypes: {} as Record<number, { 
                    name: string, 
                    count: number,
                    multiplier: number,
                    totalMultiplier: number
                }>
            }
        }

        // Count unique patients
        acc[employeeId].totalPatients++

        // Count work units and calculate multipliers
        log.units.forEach(unit => {
            const workTypeId = unit.workType.id
            if (!acc[employeeId].workTypes[workTypeId]) {
                acc[employeeId].workTypes[workTypeId] = {
                    name: unit.workType.name,
                    count: 0,
                    multiplier: unit.workType.multiplier,
                    totalMultiplier: 0
                }
            }
            // Increment count and add multiplier for each unit
            acc[employeeId].workTypes[workTypeId].count++
            acc[employeeId].workTypes[workTypeId].totalMultiplier += unit.workType.multiplier
            acc[employeeId].totalMultiplier += unit.workType.multiplier
        })

        return acc
    }, {} as Record<number, {
        employee: { id: number, name: string },
        totalPatients: number,
        totalMultiplier: number,
        workTypes: Record<number, { 
            name: string, 
            count: number,
            multiplier: number,
            totalMultiplier: number
        }>
    }>)

    const tableContent = (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Karyawan</TableHead>
                        <TableHead className="font-semibold">Total Pasien</TableHead>
                        <TableHead className="font-semibold">Total Pekerjaan</TableHead>
                        <TableHead className="font-semibold">Rincian Pekerjaan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.values(summaryByEmployee).map((summary) => (
                        <TableRow key={summary.employee.id}>
                            <TableCell className="font-medium">
                                {summary.employee.name}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-normal">
                                    {summary.totalPatients} pasien
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-normal">
                                    {summary.totalMultiplier} kali
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1.5">
                                    {Object.values(summary.workTypes).map((workType) => (
                                        <div key={workType.name} className="text-sm">
                                            <span className="text-muted-foreground">
                                                {workType.name}:
                                            </span>
                                            {" "}
                                            <span>
                                                {workType.count} kali
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {Object.keys(summaryByEmployee).length > 0 && (
                        <TableRow className="bg-muted/50 font-medium">
                            <TableCell>Total Keseluruhan</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-medium">
                                    {Object.values(summaryByEmployee).reduce((sum, summary) => sum + summary.totalPatients, 0)} pasien
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="font-medium">
                                    {Object.values(summaryByEmployee).reduce((sum, summary) => sum + summary.totalMultiplier, 0)} kali
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1.5">
                                    {Object.entries(
                                        Object.values(summaryByEmployee).reduce((acc, summary) => {
                                            Object.values(summary.workTypes).forEach(workType => {
                                                if (!acc[workType.name]) {
                                                    acc[workType.name] = {
                                                        count: 0,
                                                        multiplier: workType.multiplier,
                                                        totalMultiplier: 0
                                                    }
                                                }
                                                acc[workType.name].count += workType.count
                                                acc[workType.name].totalMultiplier += workType.totalMultiplier
                                            })
                                            return acc
                                        }, {} as Record<string, { count: number, multiplier: number, totalMultiplier: number }>)
                                    ).map(([name, total]) => (
                                        <div key={name} className="text-sm">
                                            <span className="text-muted-foreground">
                                                {name}:
                                            </span>
                                            {" "}
                                            <span>
                                                {total.count} kali
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {Object.keys(summaryByEmployee).length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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