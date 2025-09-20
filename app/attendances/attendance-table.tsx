"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo, useCallback } from "react"
import { format, addMonths, subMonths, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableFooter,
} from "@/components/ui/table"
import { AttendanceEditDialog } from "./index"
import {
    Attendance,
    AttendanceType,
    AttendancesAtDate,
    upsertAttendance,
    EmployeeAttendanceSummary,
} from "@/lib/api/attendance"
import { getAttendances } from "@/lib/api/attendance"
import { Employee } from "@/lib/api/employee"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Session } from "next-auth"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface AttendanceTableProps {
    session: Session | null
    employees: Employee[]
    attendanceTypes: AttendanceType[]
}

interface AttendanceCellData {
    employeeID: number
    date: string
    attendance?: Attendance
    isMutable: boolean
}

export function AttendanceTable({
    session,
    employees,
    attendanceTypes,
}: AttendanceTableProps) {
    const searchParams = useSearchParams()
    const monthParam = searchParams.get("month")

    // Memoize the month to prevent unnecessary re-renders
    const currentMonth = useMemo(() => {
        return monthParam ? parseISO(monthParam + "-01") : new Date()
    }, [monthParam])

    const [attendances, setAttendances] = useState<AttendancesAtDate[]>([])
    const [employeeSummaries, setEmployeeSummaries] = useState<
        EmployeeAttendanceSummary[]
    >([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedCell, setSelectedCell] = useState<AttendanceCellData | null>(
        null,
    )

    // Memoize filtered employees to prevent unnecessary re-filtering
    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => emp.showInAttendances)
    }, [employees])

    // Load attendance data
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Load attendance data for the current month
                const attendanceData = await getAttendances(
                    format(currentMonth, "yyyy-MM"),
                )
                setAttendances(attendanceData.dailyAttendances || [])
                setEmployeeSummaries(attendanceData.employeeSummaries || [])
            } catch (error) {
                console.error("Error loading data:", error)
                setError("Gagal memuat data kehadiran. Silakan coba lagi.")
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [currentMonth, session]) // Depend on currentMonth and session

    // Generate dates for the current month
    const monthDates = useMemo(() => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month, i + 1)
            return format(date, "yyyy-MM-dd")
        })
    }, [currentMonth])

    // Check if a date is mutable (current month, next month, or last month)
    const isDateMutable = useCallback((dateStr: string): boolean => {
        const date = parseISO(dateStr)
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastMonthStart = subMonths(currentMonthStart, 1)
        const nextMonthStart = addMonths(currentMonthStart, 1)

        return date >= lastMonthStart && date < addMonths(nextMonthStart, 1)
    }, [])

    // Get attendance for a specific employee and date
    const getAttendance = useCallback(
        (employeeID: number, date: string): Attendance | undefined => {
            const dateAttendances = attendances.find((a) => a.date === date)
            return dateAttendances?.attendances.find(
                (a) => a.employeeID === employeeID,
            )
        },
        [attendances],
    )

    // Get summary for a specific employee
    const getEmployeeSummary = useCallback(
        (employeeID: number): EmployeeAttendanceSummary | undefined => {
            return employeeSummaries.find(
                (summary) => summary.employeeID === employeeID,
            )
        },
        [employeeSummaries],
    )

    // Handle cell click
    const handleCellClick = useCallback(
        (employeeID: number, date: string): void => {
            if (!isDateMutable(date)) return

            setSelectedCell({
                employeeID,
                date,
                attendance: getAttendance(employeeID, date),
                isMutable: true,
            })
        },
        [isDateMutable, getAttendance],
    )

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (
            event: React.KeyboardEvent,
            employeeID: number,
            date: string,
        ): void => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                handleCellClick(employeeID, date)
            }
        },
        [handleCellClick],
    )

    // Handle attendance update
    const handleAttendanceUpdate = useCallback(
        async (data: {
            employeeID: number
            date: string
            typeID: number
            overtimeHours: number
        }): Promise<void> => {
            try {
                // Use the upsert Attendance function from the API
                await upsertAttendance(
                    {
                        employeeID: data.employeeID,
                        date: data.date,
                        typeID: data.typeID,
                        overtimeHours: data.overtimeHours,
                    },
                    session,
                )

                // Refresh the data
                const newAttendanceData = await getAttendances(
                    format(currentMonth, "yyyy-MM"),
                    session,
                )
                setAttendances(newAttendanceData.dailyAttendances || [])
                setEmployeeSummaries(newAttendanceData.employeeSummaries || [])
                setSelectedCell(null)

                // Show success message
                toast.success("Kehadiran berhasil diperbarui")
            } catch (error) {
                console.error("Error updating attendance:", error)
                toast.error("Gagal memperbarui kehadiran. Silakan coba lagi.")
            }
        },
        [currentMonth],
    )

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                    Loading kehadiran...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-500 mb-2">⚠️</div>
                <p className="text-red-600 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Coba Lagi
                </button>
            </div>
        )
    }

    if (filteredEmployees.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-muted-foreground">
                    Tidak ada karyawan yang ditampilkan dalam kehadiran.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <TooltipProvider>
                <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-32 sticky left-0 bg-muted/50 z-10">
                                        Tanggal
                                    </TableHead>
                                    {filteredEmployees.map((employee) => (
                                        <TableHead
                                            key={employee.id}
                                            className="text-center min-w-[120px]"
                                        >
                                            {employee.name}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthDates.map((date: string) => (
                                    <TableRow key={date}>
                                        <TableCell className="font-medium sticky left-0 bg-background z-10">
                                            {format(
                                                parseISO(date),
                                                "dd MMM yyyy",
                                                { locale: id },
                                            )}
                                        </TableCell>
                                        {filteredEmployees.map((employee) => {
                                            const attendance = getAttendance(
                                                employee.id,
                                                date,
                                            )
                                            const isMutable =
                                                isDateMutable(date)

                                            return (
                                                <TableCell
                                                    key={employee.id}
                                                    className={cn(
                                                        "text-center transition-colors border-l",
                                                        isMutable
                                                            ? "cursor-pointer hover:bg-muted/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                            : "cursor-not-allowed opacity-50 bg-muted/20",
                                                    )}
                                                    onClick={() =>
                                                        handleCellClick(
                                                            employee.id,
                                                            date,
                                                        )
                                                    }
                                                    onKeyDown={(e) =>
                                                        handleKeyDown(
                                                            e,
                                                            employee.id,
                                                            date,
                                                        )
                                                    }
                                                    tabIndex={
                                                        isMutable ? 0 : -1
                                                    }
                                                    role={
                                                        isMutable
                                                            ? "button"
                                                            : undefined
                                                    }
                                                    aria-label={
                                                        isMutable
                                                            ? `Edit kehadiran ${employee.name} pada ${format(parseISO(date), "dd MMM yyyy", { locale: id })}`
                                                            : undefined
                                                    }
                                                >
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="w-full h-full">
                                                                {attendance ? (
                                                                    <div className="space-y-1">
                                                                        <div className="text-sm font-medium">
                                                                            {
                                                                                attendance
                                                                                    .type
                                                                                    .name
                                                                            }
                                                                        </div>
                                                                        {attendance.overtimeHours >
                                                                            0 && (
                                                                            <div className="text-xs text-muted-foreground">
                                                                                +
                                                                                {
                                                                                    attendance.overtimeHours
                                                                                }{" "}
                                                                                jam
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-sm text-muted-foreground">
                                                                        -
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="text-center">
                                                                <div className="font-medium">
                                                                    {
                                                                        employee.name
                                                                    }
                                                                </div>
                                                                <div className="text-sm opacity-90">
                                                                    {format(
                                                                        parseISO(
                                                                            date,
                                                                        ),
                                                                        "dd MMMM yyyy",
                                                                        {
                                                                            locale: id,
                                                                        },
                                                                    )}
                                                                </div>
                                                                {attendance && (
                                                                    <div className="text-sm opacity-75 mt-1">
                                                                        {
                                                                            attendance
                                                                                .type
                                                                                .name
                                                                        }
                                                                        {attendance.overtimeHours >
                                                                            0 &&
                                                                            ` • +${attendance.overtimeHours} jam`}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow className="bg-muted/30">
                                    <TableCell className="font-medium sticky left-0 bg-muted/30 z-10">
                                        Ringkasan Bulanan
                                    </TableCell>
                                    {filteredEmployees.map((employee) => {
                                        const summary = getEmployeeSummary(
                                            employee.id,
                                        )

                                        if (isLoading) {
                                            return (
                                                <TableCell
                                                    key={employee.id}
                                                    className="text-center text-sm"
                                                >
                                                    <div className="animate-pulse bg-muted h-4 w-16 mx-auto rounded"></div>
                                                </TableCell>
                                            )
                                        }

                                        if (!summary) {
                                            return (
                                                <TableCell
                                                    key={employee.id}
                                                    className="text-center text-sm text-muted-foreground"
                                                >
                                                    -
                                                </TableCell>
                                            )
                                        }

                                        // Format detailed benefits
                                        const benefitEntries = Object.entries(
                                            summary.daysByBenefit,
                                        )
                                            .filter(([_, count]) => count > 0)
                                            .sort(([a], [b]) =>
                                                a < b ? -1 : 1,
                                            ) // Sort by benefit name

                                        return (
                                            <TableCell
                                                key={employee.id}
                                                className="text-center text-sm"
                                            >
                                                <div className="space-y-1">
                                                    <div className="font-medium">
                                                        {summary.workingDays}{" "}
                                                        hari kerja
                                                    </div>
                                                    {benefitEntries.length >
                                                        0 && (
                                                        <div className="space-y-0.5">
                                                            {benefitEntries.map(
                                                                ([
                                                                    benefit,
                                                                    count,
                                                                ]) => (
                                                                    <div
                                                                        key={
                                                                            benefit
                                                                        }
                                                                        className="text-xs text-blue-600"
                                                                    >
                                                                        {count}{" "}
                                                                        {
                                                                            benefit
                                                                        }
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                    {summary.overtimeHours >
                                                        0 && (
                                                        <div className="text-xs text-orange-600">
                                                            +
                                                            {
                                                                summary.overtimeHours
                                                            }{" "}
                                                            jam lembur
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </TooltipProvider>

            {selectedCell && (
                <AttendanceEditDialog
                    cellData={selectedCell}
                    attendanceTypes={attendanceTypes}
                    onSave={handleAttendanceUpdate}
                    onClose={() => setSelectedCell(null)}
                />
            )}
        </div>
    )
}
