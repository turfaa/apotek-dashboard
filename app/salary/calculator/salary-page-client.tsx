"use client"

import { use, useEffect, useState, useCallback } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import {
    Salary,
    SalarySnapshot,
    getSalary,
    getSalarySnapshots,
    createSalarySnapshot,
    deleteSalarySnapshot,
} from "@/lib/api/salary"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SalaryCard } from "../components/salary-card"
import { Button } from "@/components/ui/button"
import { Camera, Plus, Info, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { AddComponentDialog } from "../components/add-component-dialog"
import { AddExtraInfoDialog } from "../components/add-extra-info-dialog"
import { DeleteSnapshotDialog } from "../snapshots/delete-snapshot-dialog"
import { useSalaryMutations } from "../hooks"

interface SalaryPageClientProps {
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
    searchParamsPromise: Promise<{
        month: string
        employeeID?: string
    }>
}

export function SalaryPageClient({
    employeesPromise,
    sessionPromise,
    searchParamsPromise,
}: SalaryPageClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const session = use(sessionPromise)
    const searchParams = use(searchParamsPromise)

    const [salary, setSalary] = useState<Salary | null>(null)
    const [loading, setLoading] = useState(false)
    const [creatingSnapshot, setCreatingSnapshot] = useState(false)
    const [showAddComponentDialog, setShowAddComponentDialog] = useState(false)
    const [showAddExtraInfoDialog, setShowAddExtraInfoDialog] = useState(false)
    const [existingSnapshot, setExistingSnapshot] = useState<SalarySnapshot | null>(null)
    const [showDeleteSnapshotDialog, setShowDeleteSnapshotDialog] = useState(false)
    const [deletingSnapshot, setDeletingSnapshot] = useState(false)

    const selectedEmployee = searchParams.employeeID
        ? employees.find((emp) => emp.id.toString() === searchParams.employeeID)
        : null

    const loadSalary = useCallback(async () => {
        if (searchParams.month && searchParams.employeeID && session) {
            setLoading(true)
            try {
                const salaryData = await getSalary(
                    parseInt(searchParams.employeeID),
                    searchParams.month,
                    session,
                )
                setSalary(salaryData)
            } catch (error) {
                console.error("Failed to load salary:", error)
            } finally {
                setLoading(false)
            }
        } else {
            setSalary(null)
        }
    }, [searchParams.month, searchParams.employeeID, session])

    const loadExistingSnapshot = useCallback(async () => {
        if (searchParams.month && searchParams.employeeID && session) {
            try {
                const snapshots = await getSalarySnapshots(
                    {
                        month: searchParams.month,
                        employeeID: parseInt(searchParams.employeeID),
                    },
                    session,
                )
                setExistingSnapshot(snapshots.length > 0 ? snapshots[0] : null)
            } catch (error) {
                console.error("Failed to check existing snapshot:", error)
                setExistingSnapshot(null)
            }
        } else {
            setExistingSnapshot(null)
        }
    }, [searchParams.month, searchParams.employeeID, session])

    useEffect(() => {
        loadSalary()
        loadExistingSnapshot()
    }, [loadSalary, loadExistingSnapshot])

    const { handleAddAdditionalComponent: handleAddComponent, handleAddExtraInfo } = useSalaryMutations({
        employeeID: searchParams.employeeID,
        month: searchParams.month,
        session,
        onSuccess: async () => {
            await loadSalary()
        },
    })

    const handleAddAdditionalComponent = async (
        description: string,
        amount: number,
        multiplier: number
    ) => {
        await handleAddComponent(description, amount, multiplier)
        setShowAddComponentDialog(false)
    }

    const handleAddAdditionalInfo = async (title: string, description: string) => {
        await handleAddExtraInfo(title, description)
        setShowAddExtraInfoDialog(false)
    }

    const handleCreateSnapshot = async () => {
        if (!searchParams.employeeID || !searchParams.month || !session) {
            toast.error("Pilih karyawan dan bulan terlebih dahulu")
            return
        }

        setCreatingSnapshot(true)
        try {
            await createSalarySnapshot(
                parseInt(searchParams.employeeID),
                searchParams.month,
                session
            )
            toast.success("Snapshot gaji berhasil dibuat")
            await loadExistingSnapshot()
        } catch (error) {
            console.error("Failed to create snapshot:", error)
            toast.error("Gagal membuat snapshot gaji")
        } finally {
            setCreatingSnapshot(false)
        }
    }

    const handleDeleteSnapshot = async () => {
        if (!existingSnapshot || !session) return

        setDeletingSnapshot(true)
        try {
            await deleteSalarySnapshot(existingSnapshot.id, session)
            toast.success("Snapshot gaji berhasil dihapus")
            setExistingSnapshot(null)
            setShowDeleteSnapshotDialog(false)
        } catch (error) {
            console.error("Failed to delete snapshot:", error)
            toast.error("Gagal menghapus snapshot gaji")
        } finally {
            setDeletingSnapshot(false)
        }
    }

    // Parse month for display
    const monthDate = new Date(searchParams.month + "-01")
    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })

    const hasSnapshot = existingSnapshot !== null

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
                        Karyawan
                    </label>
                    <EmployeePicker employees={employees} />
                </div>
                {!hasSnapshot && (
                    <div className="flex items-end">
                        <Button
                            onClick={handleCreateSnapshot}
                            disabled={creatingSnapshot || !selectedEmployee || !searchParams.month}
                        >
                            <Camera className="h-4 w-4 mr-2" />
                            {creatingSnapshot ? "Membuat..." : "Buat Snapshot"}
                        </Button>
                    </div>
                )}
            </div>

            {selectedEmployee && searchParams.month && hasSnapshot && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Snapshot sudah ada</AlertTitle>
                    <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <span>
                            Sudah ada snapshot gaji untuk {selectedEmployee.name} pada bulan {monthDisplay}.
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <a
                                    href={`/salary/snapshots/${existingSnapshot.id}?print=true`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Lihat Snapshot
                                </a>
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowDeleteSnapshotDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hapus Snapshot
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            {selectedEmployee && searchParams.month && !hasSnapshot && (
                <div className="flex gap-4">
                    <Button
                        onClick={() => setShowAddComponentDialog(true)}
                        variant="outline"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Komponen Tambahan
                    </Button>
                    <Button
                        onClick={() => setShowAddExtraInfoDialog(true)}
                        variant="outline"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Info Tambahan
                    </Button>
                </div>
            )}

            {selectedEmployee && searchParams.month && (
                <>
                    {loading ? (
                        <Card>
                            <CardContent className="text-center text-muted-foreground py-8">
                                Memuat data gaji...
                            </CardContent>
                        </Card>
                    ) : salary ? (
                        <SalaryCard
                            salary={salary}
                            employeeName={selectedEmployee.name}
                            monthDisplay={monthDisplay}
                        />
                    ) : (
                        <Card>
                            <CardContent className="text-center text-muted-foreground py-8">
                                Pilih karyawan dan bulan untuk melihat data gaji
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {!selectedEmployee && (
                <Card>
                    <CardContent className="text-center text-muted-foreground py-8">
                        Pilih karyawan untuk melihat data gaji
                    </CardContent>
                </Card>
            )}

            <AddComponentDialog
                open={showAddComponentDialog}
                onOpenChange={setShowAddComponentDialog}
                onAdd={handleAddAdditionalComponent}
                title="Tambah Komponen Gaji Tambahan"
                description="Tambahkan komponen gaji tambahan baru untuk karyawan ini pada bulan ini."
            />

            <AddExtraInfoDialog
                open={showAddExtraInfoDialog}
                onOpenChange={setShowAddExtraInfoDialog}
                onAdd={handleAddAdditionalInfo}
                title="Tambah Informasi Tambahan"
                description="Tambahkan informasi tambahan baru untuk karyawan ini pada bulan ini."
            />

            <DeleteSnapshotDialog
                open={showDeleteSnapshotDialog}
                onOpenChange={setShowDeleteSnapshotDialog}
                snapshot={existingSnapshot}
                onConfirm={handleDeleteSnapshot}
            />
        </div>
    )
}
