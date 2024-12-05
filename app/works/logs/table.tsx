import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getWorkLogs } from "@/lib/api/work"
import { SearchParams } from "@/types/search-params"
import { use } from "react"
import { Session } from "next-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import Link from "next/link"

export function WorkLogsTableSkeleton(): React.ReactElement {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Karyawan</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Pekerjaan</TableHead>
                        <TableHead className="w-24"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-9 w-9" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

interface WorkLogsTableProps {
    searchParams: SearchParams
    sessionPromise: Promise<Session | null>
}

export function WorkLogsTable({ searchParams, sessionPromise }: WorkLogsTableProps): React.ReactElement {
    const workLogs = 
        Promise.all([sessionPromise, searchParams])
            .then(([session, searchParams]) => getWorkLogs(searchParams.from, searchParams.until, session))
            .then(logs => logs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))

    const logs = use(workLogs)

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Karyawan</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Pekerjaan</TableHead>
                        <TableHead className="w-24"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell>
                                {log.createdAt.toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </TableCell>
                            <TableCell>{log.employee.name}</TableCell>
                            <TableCell>{log.patientName}</TableCell>
                            <TableCell>
                                <ul className="list-disc list-inside">
                                    {log.units.map((unit) => (
                                        <li key={unit.id}>
                                            {unit.workType.name}: {unit.workOutcome} {unit.workType.outcomeUnit}
                                        </li>
                                    ))}
                                </ul>
                            </TableCell>
                            <TableCell>
                                <Link
                                    href={`/api/work-logs/${log.id}/for-patient`}
                                    target="_blank"
                                    title="Cetak untuk pasien"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-pointer"
                                    >
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                    {logs.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                Tidak ada data.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
} 