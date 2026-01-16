"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RupiahInput } from "@/components/rupiah-input"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Employee } from "@/lib/api/employee"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface BulkAddComponentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (employeeIDs: number[], description: string, amount: number, multiplier: number) => void
    employees: Employee[]
    title?: string
    description?: string
}

export function BulkAddComponentDialog({
    open,
    onOpenChange,
    onAdd,
    employees,
    title = "Tambah Komponen Gaji Massal",
    description = "Tambahkan komponen gaji tambahan untuk beberapa karyawan sekaligus.",
}: BulkAddComponentDialogProps): React.ReactElement {
    const [selectedEmployeeIDs, setSelectedEmployeeIDs] = useState<number[]>([])
    const [formData, setFormData] = useState({
        description: "",
        amount: 0,
        multiplier: 1,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (
            selectedEmployeeIDs.length > 0 &&
            formData.description.trim() &&
            formData.amount != 0 &&
            formData.multiplier > 0
        ) {
            onAdd(selectedEmployeeIDs, formData.description.trim(), formData.amount, formData.multiplier)
            resetForm()
            onOpenChange(false)
        }
    }

    const resetForm = () => {
        setSelectedEmployeeIDs([])
        setFormData({
            description: "",
            amount: 0,
            multiplier: 1,
        })
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            resetForm()
        }
        onOpenChange(open)
    }

    const toggleEmployee = (employeeID: number) => {
        setSelectedEmployeeIDs((prev) =>
            prev.includes(employeeID)
                ? prev.filter((id) => id !== employeeID)
                : [...prev, employeeID]
        )
    }

    const selectAll = () => {
        setSelectedEmployeeIDs(employees.map((emp) => emp.id))
    }

    const deselectAll = () => {
        setSelectedEmployeeIDs([])
    }

    const isFormValid =
        selectedEmployeeIDs.length > 0 &&
        formData.description.trim() &&
        formData.amount != 0 &&
        formData.multiplier > 0

    const selectedEmployees = employees.filter((emp) => selectedEmployeeIDs.includes(emp.id))

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Karyawan ({selectedEmployeeIDs.length} dipilih)</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={selectAll}
                                    >
                                        Pilih Semua
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={deselectAll}
                                    >
                                        Hapus Semua
                                    </Button>
                                </div>
                            </div>
                            {selectedEmployees.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {selectedEmployees.map((emp) => (
                                        <Badge
                                            key={emp.id}
                                            variant="secondary"
                                            className="cursor-pointer"
                                            onClick={() => toggleEmployee(emp.id)}
                                        >
                                            {emp.name} &times;
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <Command className="border rounded-md">
                                <CommandInput placeholder="Cari karyawan..." />
                                <CommandList className="max-h-[200px]">
                                    <CommandEmpty>Tidak ada karyawan ditemukan.</CommandEmpty>
                                    <CommandGroup>
                                        {employees.map((employee) => (
                                            <CommandItem
                                                key={employee.id}
                                                value={employee.name}
                                                onSelect={() => toggleEmployee(employee.id)}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedEmployeeIDs.includes(employee.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {employee.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bulk-description">Deskripsi</Label>
                            <Input
                                id="bulk-description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                placeholder="Contoh: Tunjangan Transport"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bulk-multiplier">Jumlah</Label>
                            <Input
                                id="bulk-multiplier"
                                type="number"
                                min="1"
                                step="1"
                                value={formData.multiplier}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        multiplier: Number(e.target.value),
                                    }))
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bulk-amount">Fee / -Penalti</Label>
                            <RupiahInput
                                id="bulk-amount"
                                value={formData.amount}
                                onChange={(amount) => setFormData((prev) => ({ ...prev, amount }))}
                                placeholder="Masukkan jumlah dalam rupiah"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={!isFormValid}>
                            Tambah untuk {selectedEmployeeIDs.length} Karyawan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
