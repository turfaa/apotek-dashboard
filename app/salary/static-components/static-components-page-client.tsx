"use client"

import { use, useEffect, useState, useCallback } from "react"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { 
    SalaryStaticComponent, 
    getSalaryStaticComponents,
    createSalaryStaticComponent,
    deleteSalaryStaticComponent
} from "@/lib/api/salary"
import { Session } from "next-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { StaticComponentsTable } from "./static-components-table"
import { AddComponentDialog } from "./add-component-dialog"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"

interface StaticComponentsPageClientProps {
    employeesPromise: Promise<Employee[]>
    sessionPromise: Promise<Session | null>
    searchParamsPromise: Promise<{
        employeeID?: string
    }>
}

export function StaticComponentsPageClient({
    employeesPromise,
    sessionPromise,
    searchParamsPromise,
}: StaticComponentsPageClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const session = use(sessionPromise)
    const searchParams = use(searchParamsPromise)

    const [staticComponents, setStaticComponents] = useState<SalaryStaticComponent[]>([])
    const [loading, setLoading] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [componentToDelete, setComponentToDelete] = useState<SalaryStaticComponent | null>(null)

    const selectedEmployee = searchParams.employeeID
        ? employees.find((emp) => emp.id.toString() === searchParams.employeeID)
        : null

    const loadStaticComponents = useCallback(async () => {
        if (searchParams.employeeID && session) {
            setLoading(true)
            try {
                const components = await getSalaryStaticComponents(
                    parseInt(searchParams.employeeID),
                    session
                )
                setStaticComponents(components)
            } catch (error) {
                console.error("Failed to load static components:", error)
            } finally {
                setLoading(false)
            }
        } else {
            setStaticComponents([])
        }
    }, [searchParams.employeeID, session])

    useEffect(() => {
        loadStaticComponents()
    }, [searchParams.employeeID, session, loadStaticComponents])

    const handleAddComponent = async (description: string, amount: number, multiplier: number) => {
        if (!searchParams.employeeID || !session) return

        try {
            await createSalaryStaticComponent(
                parseInt(searchParams.employeeID),
                description,
                amount,
                multiplier,
                session
            )
            await loadStaticComponents() // Reload the list
            setShowAddDialog(false)
        } catch (error) {
            console.error("Failed to create static component:", error)
        }
    }

    const handleDeleteComponent = async () => {
        if (!componentToDelete || !searchParams.employeeID || !session) return

        try {
            await deleteSalaryStaticComponent(
                parseInt(searchParams.employeeID),
                componentToDelete.id,
                session
            )
            await loadStaticComponents() // Reload the list
            setShowDeleteDialog(false)
            setComponentToDelete(null)
        } catch (error) {
            console.error("Failed to delete static component:", error)
        }
    }

    const openDeleteDialog = (component: SalaryStaticComponent) => {
        setComponentToDelete(component)
        setShowDeleteDialog(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                        Karyawan
                    </label>
                    <EmployeePicker employees={employees} />
                </div>
            </div>

            {selectedEmployee && (
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>
                                Komponen Gaji Statis - {selectedEmployee.name}
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
                                Memuat komponen gaji statis...
                            </div>
                        ) : (
                            <StaticComponentsTable 
                                components={staticComponents}
                                onDelete={openDeleteDialog}
                            />
                        )}
                    </CardContent>
                </Card>
            )}

            {!selectedEmployee && (
                <Card>
                    <CardContent className="text-center text-muted-foreground py-8">
                        Pilih karyawan untuk melihat komponen gaji statis
                    </CardContent>
                </Card>
            )}

            <AddComponentDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                onAdd={handleAddComponent}
            />

            <DeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                component={componentToDelete}
                onConfirm={handleDeleteComponent}
            />
        </div>
    )
}
