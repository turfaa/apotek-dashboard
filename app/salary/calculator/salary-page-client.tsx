"use client"

import { use, useEffect, useState, useCallback } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { 
    Salary, 
    getSalary, 
    createSalarySnapshot
} from "@/lib/api/salary"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { SalaryCard } from "../components/salary-card"
import { Button } from "@/components/ui/button"
import { Camera, Plus } from "lucide-react"
import { toast } from "sonner"
import { AddComponentDialog } from "../components/add-component-dialog"
import { AddExtraInfoDialog } from "../components/add-extra-info-dialog"
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

    useEffect(() => {
        loadSalary()
    }, [loadSalary])

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
        } catch (error) {
            console.error("Failed to create snapshot:", error)
            toast.error("Gagal membuat snapshot gaji")
        } finally {
            setCreatingSnapshot(false)
        }
    }

    // Parse month for display
    const monthDate = new Date(searchParams.month + "-01")
    const monthDisplay = format(monthDate, "MMMM yyyy", { locale: id })

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
                <div className="flex items-end">
                    <Button 
                        onClick={handleCreateSnapshot}
                        disabled={creatingSnapshot || !selectedEmployee || !searchParams.month}
                    >
                        <Camera className="h-4 w-4 mr-2" />
                        {creatingSnapshot ? "Membuat..." : "Buat Snapshot"}
                    </Button>
                </div>
            </div>

            {selectedEmployee && searchParams.month && (
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
        </div>
    )
}
