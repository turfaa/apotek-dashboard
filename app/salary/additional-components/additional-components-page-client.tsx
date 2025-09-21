"use client"

import { use, useEffect, useState, useCallback } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { 
    SalaryAdditionalComponent, 
    SalaryStaticComponent,
    getSalaryAdditionalComponents,
    createSalaryAdditionalComponent,
    deleteSalaryAdditionalComponent
} from "@/lib/api/salary"
import { Session } from "next-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { SalaryComponentsTable } from "../components/salary-components-table"
import { AddComponentDialog } from "../components/add-component-dialog"
import { DeleteConfirmDialog } from "../components/delete-confirm-dialog"

interface AdditionalComponentsPageClientProps {
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
    searchParamsPromise: Promise<{
        employeeID?: string
        month: string
    }>
}

export function AdditionalComponentsPageClient({
    employeesPromise,
    sessionPromise,
    searchParamsPromise,
}: AdditionalComponentsPageClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const session = use(sessionPromise)
    const searchParams = use(searchParamsPromise)

    const [additionalComponents, setAdditionalComponents] = useState<SalaryAdditionalComponent[]>([])
    const [loading, setLoading] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [componentToDelete, setComponentToDelete] = useState<SalaryAdditionalComponent | null>(null)

    const selectedEmployee = searchParams.employeeID
        ? employees.find((emp) => emp.id.toString() === searchParams.employeeID)
        : null

    // Parse month for display
    const monthDate = new Date(searchParams.month + "-01")
    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })

    const loadAdditionalComponents = useCallback(async () => {
        if (searchParams.employeeID && searchParams.month && session) {
            setLoading(true)
            try {
                const components = await getSalaryAdditionalComponents(
                    parseInt(searchParams.employeeID),
                    searchParams.month,
                    session
                )
                setAdditionalComponents(components)
            } catch (error) {
                console.error("Failed to load additional components:", error)
            } finally {
                setLoading(false)
            }
        } else {
            setAdditionalComponents([])
        }
    }, [searchParams.employeeID, searchParams.month, session])

    useEffect(() => {
        loadAdditionalComponents()
    }, [loadAdditionalComponents])

    const handleAddComponent = async (description: string, amount: number, multiplier: number) => {
        if (!searchParams.employeeID || !searchParams.month || !session) return

        try {
            await createSalaryAdditionalComponent(
                parseInt(searchParams.employeeID),
                searchParams.month,
                description,
                amount,
                multiplier,
                session
            )
            await loadAdditionalComponents() // Reload the list
            setShowAddDialog(false)
        } catch (error) {
            console.error("Failed to create additional component:", error)
        }
    }

    const handleDeleteComponent = async () => {
        if (!componentToDelete || !searchParams.employeeID || !searchParams.month || !session) return

        try {
            await deleteSalaryAdditionalComponent(
                parseInt(searchParams.employeeID),
                searchParams.month,
                componentToDelete.id,
                session
            )
            await loadAdditionalComponents() // Reload the list
            setShowDeleteDialog(false)
            setComponentToDelete(null)
        } catch (error) {
            console.error("Failed to delete additional component:", error)
        }
    }

    const openDeleteDialog = (component: SalaryStaticComponent | SalaryAdditionalComponent) => {
        setComponentToDelete(component as SalaryAdditionalComponent)
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
                                Komponen Gaji Tambahan - {selectedEmployee.name} - {monthDisplay}
                            </CardTitle>
                            <Button onClick={() => setShowAddDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Komponen
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-muted-foreground py-8">
                                Memuat komponen gaji tambahan...
                            </div>
                        ) : (
                            <SalaryComponentsTable 
                                components={additionalComponents}
                                onDelete={openDeleteDialog}
                                emptyMessage="Belum ada komponen gaji tambahan untuk karyawan ini pada bulan ini"
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {!selectedEmployee && (
                <Card>
                    <CardContent className="text-center text-muted-foreground py-8">
                        Pilih karyawan untuk melihat komponen gaji tambahan
                    </CardContent>
                </Card>
            )}

            <AddComponentDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onAdd={handleAddComponent}
                title="Tambah Komponen Gaji Tambahan"
                description="Tambahkan komponen gaji tambahan baru untuk karyawan ini pada bulan ini."
            />

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                component={componentToDelete}
                onConfirm={handleDeleteComponent}
                title="Hapus Komponen Gaji Tambahan"
                description="Apakah Anda yakin ingin menghapus komponen gaji tambahan ini? Tindakan ini tidak dapat dibatalkan."
            />
        </div>
    )
}
