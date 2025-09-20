"use client"

import { use, useEffect, useState } from "react"
import MonthPicker from "@/components/month-picker"
import { EmployeePicker } from "@/components/employee-picker"
import { Employee } from "@/lib/api/employee"
import { Salary, getSalary } from "@/lib/api/salary"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Session } from "next-auth"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    searchParamsPromise
}: SalaryPageClientProps): React.ReactElement {
    const employees = use(employeesPromise)
    const session = use(sessionPromise)
    const searchParams = use(searchParamsPromise)
    
    const [salary, setSalary] = useState<Salary | null>(null)
    const [loading, setLoading] = useState(false)
    
    const selectedEmployee = searchParams.employeeID ? employees.find(emp => emp.id.toString() === searchParams.employeeID) : null
    
    useEffect(() => {
        if (searchParams.month && searchParams.employeeID && session) {
            setLoading(true)
            getSalary(parseInt(searchParams.employeeID), searchParams.month, session)
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
                    <label className="text-sm font-medium mb-2 block">Bulan</label>
                    <MonthPicker />
                </div>
                <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Karyawan</label>
                    <EmployeePicker employees={employees} />
                </div>
            </div>

            {selectedEmployee && searchParams.month && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Gaji {selectedEmployee.name} - {monthDisplay}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-muted-foreground py-8">
                                Memuat data gaji...
                            </div>
                        ) : salary ? (
                            <SalaryTable salary={salary} />
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                Pilih karyawan dan bulan untuk melihat data gaji
                            </div>
                        )}
                    </CardContent>
                </Card>
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

interface SalaryTableProps {
    salary: Salary
}

function SalaryTable({ salary }: SalaryTableProps): React.ReactElement {
    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Komponen</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead className="text-right">Fee / (Penalti)</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salary.components.map((component, index) => (
                        <TableRow key={index}>
                            <TableCell>{component.description}</TableCell>
                            <TableCell className="text-right">
                                {component.multiplier.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-right">
                                Rp {component.amount.toLocaleString('id-ID')}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                Rp {component.total.toLocaleString('id-ID')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Gaji:</span>
                    <span className="text-lg font-bold">
                        Rp {salary.total.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>
        </div>
    )
}
