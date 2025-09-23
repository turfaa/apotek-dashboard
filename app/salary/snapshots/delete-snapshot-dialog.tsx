"use client"

import { SalarySnapshot } from "@/lib/api/salary"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { rupiah } from "@/lib/rupiah"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteSnapshotDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    snapshot: SalarySnapshot | null
    onConfirm: () => void
}

export function DeleteSnapshotDialog({
    open,
    onOpenChange,
    snapshot,
    onConfirm,
}: DeleteSnapshotDialogProps): React.ReactElement {
    const handleConfirm = () => {
        onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Hapus Snapshot Gaji</DialogTitle>
                    <DialogDescription>
                        Apakah Anda yakin ingin menghapus snapshot gaji ini? Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                
                {snapshot && (
                    <div className="py-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Snapshot Gaji</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <div>Karyawan ID: {snapshot.employeeID}</div>
                                <div>Bulan: {format(new Date(snapshot.month + "-01"), "MMMM yyyy", { locale: id })}</div>
                                <div>Total (Tanpa Utang): {rupiah.format(snapshot.salary.totalWithoutDebt)}</div>
                                <div>Total: {rupiah.format(snapshot.salary.total)}</div>
                                <div>Dibuat: {format(snapshot.createdAt, "dd MMM yyyy 'pukul' HH:mm", { locale: id })}</div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Batal
                    </Button>
                    <Button variant="destructive" onClick={handleConfirm}>
                        Hapus
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
