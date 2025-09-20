"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Employee } from "@/lib/api/employee"
import { deleteWorkLog } from "@/lib/api/work"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteWorkLogDialogProps {
    workLogId: number
    employees: Employee[]
}

export function DeleteWorkLogDialog({
    workLogId,
    employees,
}: DeleteWorkLogDialogProps) {
    const [open, setOpen] = useState(false)
    const [employeeId, setEmployeeId] = useState<string>("")
    const router = useRouter()

    const handleDelete = async () => {
        try {
            await deleteWorkLog(workLogId, Number(employeeId))
            toast.success("Laporan pekerjaan berhasil dihapus")
            setOpen(false)
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus laporan pekerjaan")
            console.error(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Laporan Pekerjaan</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus laporan pekerjaan ini?
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <Select value={employeeId} onValueChange={setEmployeeId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih karyawan yang menghapus" />
                        </SelectTrigger>
                        <SelectContent>
                            {employees.map((employee) => (
                                <SelectItem
                                    key={employee.id}
                                    value={employee.id.toString()}
                                >
                                    {employee.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={!employeeId}
                    >
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
