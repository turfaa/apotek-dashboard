"use client"

import { useEffect, useState, useCallback } from "react"
import {
    SalaryAdditionalComponent,
    SalaryStaticComponent,
    getSalaryAdditionalComponents,
    deleteSalaryAdditionalComponent,
} from "@/lib/api/salary"
import { Session } from "next-auth"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { SalaryComponentsTable } from "./salary-components-table"
import { DeleteConfirmDialog } from "./delete-confirm-dialog"
import { toast } from "sonner"

interface RemoveAdditionalComponentsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    employeeID: number
    month: string
    session: Session | null
    onSuccess?: () => void | Promise<void>
}

export function RemoveAdditionalComponentsDialog({
    open,
    onOpenChange,
    employeeID,
    month,
    session,
    onSuccess,
}: RemoveAdditionalComponentsDialogProps): React.ReactElement {
    const [components, setComponents] = useState<SalaryAdditionalComponent[]>([])
    const [loading, setLoading] = useState(false)
    const [componentToDelete, setComponentToDelete] = useState<SalaryAdditionalComponent | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const loadComponents = useCallback(async () => {
        if (!session) return
        setLoading(true)
        try {
            const data = await getSalaryAdditionalComponents(employeeID, month, session)
            setComponents(data)
        } catch (error) {
            console.error("Failed to load additional components:", error)
        } finally {
            setLoading(false)
        }
    }, [employeeID, month, session])

    useEffect(() => {
        if (open) {
            loadComponents()
        }
    }, [open, loadComponents])

    const handleDeleteClick = (component: SalaryStaticComponent | SalaryAdditionalComponent) => {
        setComponentToDelete(component as SalaryAdditionalComponent)
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = async () => {
        if (!componentToDelete || !session) return
        try {
            await deleteSalaryAdditionalComponent(employeeID, month, componentToDelete.id, session)
            toast.success("Komponen gaji tambahan berhasil dihapus")
            setShowDeleteConfirm(false)
            setComponentToDelete(null)
            await loadComponents()
            await onSuccess?.()
        } catch (error) {
            console.error("Failed to delete additional component:", error)
            toast.error("Gagal menghapus komponen gaji tambahan")
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Hapus Komponen Gaji Tambahan</DialogTitle>
                        <DialogDescription>
                            Pilih komponen gaji tambahan yang ingin dihapus.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-8">
                                Memuat komponen gaji tambahan...
                            </div>
                        ) : (
                            <SalaryComponentsTable
                                components={components}
                                onDelete={handleDeleteClick}
                                emptyMessage="Belum ada komponen gaji tambahan untuk karyawan ini pada bulan ini"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <DeleteConfirmDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                component={componentToDelete}
                onConfirm={handleDeleteConfirm}
                title="Hapus Komponen Gaji Tambahan"
                description="Apakah Anda yakin ingin menghapus komponen gaji tambahan ini? Tindakan ini tidak dapat dibatalkan."
            />
        </>
    )
}
