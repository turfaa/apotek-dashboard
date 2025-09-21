"use client"

import { use, useEffect, useState, useCallback } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { 
    SalaryExtraInfo, 
    getSalaryExtraInfos,
    createSalaryExtraInfo,
    deleteSalaryExtraInfo
} from "@/lib/api/salary"
import { Session } from "next-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { ExtraInfosTable } from "../components/extra-infos-table"
import { AddExtraInfoDialog } from "../components/add-extra-info-dialog"
import { DeleteExtraInfoDialog } from "../components/delete-extra-info-dialog"

interface ExtraInfosPageClientProps {
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
    searchParamsPromise: Promise<{
        employeeID?: string
        month: string
    }>
}

export function ExtraInfosPageClient({
    employeesPromise,
    sessionPromise,
    searchParamsPromise,
}: ExtraInfosPageClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const session = use(sessionPromise)
    const searchParams = use(searchParamsPromise)

    const [extraInfos, setExtraInfos] = useState<SalaryExtraInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [extraInfoToDelete, setExtraInfoToDelete] = useState<SalaryExtraInfo | null>(null)

    const selectedEmployee = searchParams.employeeID
        ? employees.find((emp) => emp.id.toString() === searchParams.employeeID)
        : null

    // Parse month for display
    const monthDate = new Date(searchParams.month + "-01")
    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })

    const loadExtraInfos = useCallback(async () => {
        if (searchParams.employeeID && searchParams.month && session) {
            setLoading(true)
            try {
                const infos = await getSalaryExtraInfos(
                    parseInt(searchParams.employeeID),
                    searchParams.month,
                    session
                )
                setExtraInfos(infos)
            } catch (error) {
                console.error("Failed to load extra infos:", error)
            } finally {
                setLoading(false)
            }
        } else {
            setExtraInfos([])
        }
    }, [searchParams.employeeID, searchParams.month, session])

    useEffect(() => {
        loadExtraInfos()
    }, [loadExtraInfos])

    const handleAddExtraInfo = async (title: string, description: string) => {
        if (!searchParams.employeeID || !searchParams.month || !session) return

        try {
            await createSalaryExtraInfo(
                parseInt(searchParams.employeeID),
                searchParams.month,
                title,
                description,
                session
            )
            await loadExtraInfos() // Reload the list
            setShowAddDialog(false)
        } catch (error) {
            console.error("Failed to create extra info:", error)
        }
    }

    const handleDeleteExtraInfo = async () => {
        if (!extraInfoToDelete || !searchParams.employeeID || !searchParams.month || !session) return

        try {
            await deleteSalaryExtraInfo(
                parseInt(searchParams.employeeID),
                searchParams.month,
                extraInfoToDelete.id,
                session
            )
            await loadExtraInfos() // Reload the list
            setShowDeleteDialog(false)
            setExtraInfoToDelete(null)
        } catch (error) {
            console.error("Failed to delete extra info:", error)
        }
    }

    const openDeleteDialog = (extraInfo: SalaryExtraInfo) => {
        setExtraInfoToDelete(extraInfo)
        setShowDeleteDialog(true)
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
                        Karyawan
                    </label>
                    <EmployeePicker employees={employees} />
                </div>
            </div>

            {selectedEmployee && searchParams.month && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                Informasi Tambahan Gaji - {selectedEmployee.name} - {monthDisplay}
                            </CardTitle>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Informasi
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-muted-foreground py-8">
                                Memuat informasi tambahan...
                            </div>
                        ) : (
                            <ExtraInfosTable 
                                extraInfos={extraInfos}
                                onDelete={openDeleteDialog}
                                emptyMessage="Belum ada informasi tambahan untuk karyawan ini pada bulan ini"
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {!selectedEmployee && (
                <Card>
                    <CardContent className="text-center text-muted-foreground py-8">
                        Pilih karyawan untuk melihat informasi tambahan
                    </CardContent>
                </Card>
            )}

            <AddExtraInfoDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onAdd={handleAddExtraInfo}
                title="Tambah Informasi Tambahan"
                description="Tambahkan informasi tambahan baru untuk karyawan ini pada bulan ini."
            />

            <DeleteExtraInfoDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                extraInfo={extraInfoToDelete}
                onConfirm={handleDeleteExtraInfo}
                title="Hapus Informasi Tambahan"
                description="Apakah Anda yakin ingin menghapus informasi tambahan ini? Tindakan ini tidak dapat dibatalkan."
            />
        </div>
    )
}
