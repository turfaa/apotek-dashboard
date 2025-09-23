"use client"

import { use, useEffect, useState, useCallback } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { 
    SalarySnapshot, 
    getSalarySnapshots,
    deleteSalarySnapshot
} from "@/lib/api/salary"
import { Session } from "next-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { rupiah } from "@/lib/rupiah"
import { useRouter } from "next/navigation"
import { DeleteSnapshotDialog } from "./delete-snapshot-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface SnapshotsPageClientProps {
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
    searchParamsPromise: Promise<{
        employeeID?: string
        month?: string
    }>
}

export function SnapshotsPageClient({
    employeesPromise,
    sessionPromise,
    searchParamsPromise,
}: SnapshotsPageClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const session = use(sessionPromise)
    const searchParams = use(searchParamsPromise)
    const router = useRouter()

    const [snapshots, setSnapshots] = useState<SalarySnapshot[]>([])
    const [loading, setLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [snapshotToDelete, setSnapshotToDelete] = useState<SalarySnapshot | null>(null)

    const loadSnapshots = useCallback(async () => {
        if (session && searchParams.month) {
            setLoading(true)
            try {
                const request = {
                    month: searchParams.month,
                    employeeID: searchParams.employeeID ? parseInt(searchParams.employeeID) : undefined,
                }
                const snapshotList = await getSalarySnapshots(request, session)
                setSnapshots(snapshotList)
            } catch (error) {
                console.error("Failed to load snapshots:", error)
            } finally {
                setLoading(false)
            }
        } else {
            setSnapshots([])
        }
    }, [searchParams.month, searchParams.employeeID, session])

    useEffect(() => {
        loadSnapshots()
    }, [loadSnapshots])

    const handleDeleteSnapshot = async () => {
        if (!snapshotToDelete || !session) return

        try {
            await deleteSalarySnapshot(snapshotToDelete.id, session)
            await loadSnapshots() // Reload the list
            setShowDeleteDialog(false)
            setSnapshotToDelete(null)
        } catch (error) {
            console.error("Failed to delete snapshot:", error)
        }
    }

    const openDeleteDialog = (snapshot: SalarySnapshot) => {
        setSnapshotToDelete(snapshot)
        setShowDeleteDialog(true)
    }

    const viewSnapshot = (snapshot: SalarySnapshot) => {
        router.push(`/salary/snapshots/${snapshot.id}`)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                        Bulan
                    </label>
                    <MonthPicker />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                        Karyawan (Opsional)
                    </label>
                    <EmployeePicker employees={employees} />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Snapshot Gaji</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center text-muted-foreground py-8">
                            Memuat snapshot gaji...
                        </div>
                    ) : snapshots.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            Belum ada snapshot gaji
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Karyawan</TableHead>
                                    <TableHead>Bulan</TableHead>
                                    <TableHead className="text-right">Total (Tanpa Utang)</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Dibuat</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {snapshots.map((snapshot) => {
                                    const employee = employees.find(emp => emp.id === snapshot.employeeID)
                                    const monthDate = new Date(snapshot.month + "-01")
                                    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })
                                    
                                    return (
                                        <TableRow key={snapshot.id}>
                                            <TableCell className="font-medium">
                                                {employee?.name || "Karyawan tidak ditemukan"}
                                            </TableCell>
                                            <TableCell>{monthDisplay}</TableCell>
                                            <TableCell className="text-right">
                                                {rupiah.format(snapshot.salary.totalWithoutDebt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {rupiah.format(snapshot.salary.total)}
                                            </TableCell>
                                            <TableCell>
                                                {format(snapshot.createdAt, "dd MMM yyyy HH:mm", { locale: id })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => viewSnapshot(snapshot)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => openDeleteDialog(snapshot)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <DeleteSnapshotDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                snapshot={snapshotToDelete}
                onConfirm={handleDeleteSnapshot}
            />
        </div>
    )
}
