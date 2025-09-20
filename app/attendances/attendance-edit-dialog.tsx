"use client"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AttendanceType, Attendance } from "@/lib/api/attendance"
import { getEmployees } from "@/lib/api/employee"

interface AttendanceEditDialogProps {
    cellData: {
        employeeID: number
        date: string
        attendance?: Attendance
        isMutable: boolean
    }
    attendanceTypes: AttendanceType[]
    onSave: (data: {
        employeeID: number
        date: string
        typeID: number
        overtimeHours: number
    }) => void
    onClose: () => void
}

export function AttendanceEditDialog({
    cellData,
    attendanceTypes,
    onSave,
    onClose,
}: AttendanceEditDialogProps) {
    const [employeeName, setEmployeeName] = useState<string>("")
    const [selectedTypeID, setSelectedTypeID] = useState<string>("")
    const [overtimeHours, setOvertimeHours] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    // Load employee name
    useEffect(() => {
        getEmployees().then((employees) => {
            const employee = employees.find(
                (emp) => emp.id === cellData.employeeID,
            )
            if (employee) {
                setEmployeeName(employee.name)
            }
        })
    }, [cellData.employeeID])

    // Set initial values
    useEffect(() => {
        if (cellData.attendance) {
            setSelectedTypeID(cellData.attendance.type.id.toString())
            setOvertimeHours(cellData.attendance.overtimeHours.toString())
        } else {
            setSelectedTypeID("")
            setOvertimeHours("0")
        }
    }, [cellData.attendance])

    const handleSave = () => {
        if (!selectedTypeID) return

        setIsLoading(true)
        onSave({
            employeeID: cellData.employeeID,
            date: cellData.date,
            typeID: parseInt(selectedTypeID),
            overtimeHours: parseFloat(overtimeHours) || 0,
        })
        // Note: We don't set isLoading to false here because the parent component
        // will handle the loading state and close the dialog when done
    }

    const formatDate = (dateStr: string) => {
        return format(parseISO(dateStr), "dd MMMM yyyy", { locale: id })
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Kehadiran</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="employee" className="text-right">
                            Karyawan
                        </Label>
                        <div className="col-span-3 font-medium">
                            {employeeName}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Tanggal
                        </Label>
                        <div className="col-span-3 font-medium">
                            {formatDate(cellData.date)}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Tipe Kehadiran
                        </Label>
                        <div className="col-span-3">
                            <Select
                                value={selectedTypeID}
                                onValueChange={setSelectedTypeID}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih tipe kehadiran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {attendanceTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id.toString()}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span>{type.name}</span>
                                                {type.payableType ===
                                                    "working" && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        Kerja
                                                    </span>
                                                )}
                                                {type.payableType ===
                                                    "benefit" && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        Benefit
                                                    </span>
                                                )}
                                                {type.payableType ===
                                                    "none" && (
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        Tidak Ada
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="overtime" className="text-right">
                            Lembur (jam)
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="overtime"
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                value={overtimeHours}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (
                                        value === "" ||
                                        (parseFloat(value) >= 0 &&
                                            parseFloat(value) <= 24)
                                    ) {
                                        setOvertimeHours(value)
                                    }
                                }}
                                placeholder="0"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Masukkan jumlah jam lembur (contoh: 2.5 untuk 2
                                jam 30 menit)
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading || !selectedTypeID}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
