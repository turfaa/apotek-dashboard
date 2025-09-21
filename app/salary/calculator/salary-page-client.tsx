"use client"

import { use, useEffect, useState } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { Salary, getSalary } from "@/lib/api/salary"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { SalaryCard } from "../components/salary-card"

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

    const selectedEmployee = searchParams.employeeID
        ? employees.find((emp) => emp.id.toString() === searchParams.employeeID)
        : null

    useEffect(() => {
        if (searchParams.month && searchParams.employeeID && session) {
            setLoading(true)
            getSalary(
                parseInt(searchParams.employeeID),
                searchParams.month,
                session,
            )
                .then(setSalary)
                .catch(console.error)
                .finally(() => setLoading(false))
        } else {
            setSalary(null)
        }
    }, [searchParams.month, searchParams.employeeID, session])

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
            </div>

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
        </div>
    )
}
