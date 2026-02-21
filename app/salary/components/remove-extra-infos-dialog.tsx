"use client"

import { useEffect, useState, useCallback } from "react"
import {
    SalaryExtraInfo,
    getSalaryExtraInfos,
    deleteSalaryExtraInfo,
} from "@/lib/api/salary"
import { Session } from "next-auth"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ExtraInfosTable } from "./extra-infos-table"
import { DeleteExtraInfoDialog } from "./delete-extra-info-dialog"
import { toast } from "sonner"

interface RemoveExtraInfosDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    employeeID: number
    month: string
    session: Session | null
    onSuccess?: () => void | Promise<void>
}

export function RemoveExtraInfosDialog({
    open,
    onOpenChange,
    employeeID,
    month,
    session,
    onSuccess,
}: RemoveExtraInfosDialogProps): React.ReactElement {
    const [extraInfos, setExtraInfos] = useState<SalaryExtraInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [extraInfoToDelete, setExtraInfoToDelete] = useState<SalaryExtraInfo | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const loadExtraInfos = useCallback(async () => {
        if (!session) return
        setLoading(true)
        try {
            const data = await getSalaryExtraInfos(employeeID, month, session)
            setExtraInfos(data)
        } catch (error) {
            console.error("Failed to load extra infos:", error)
        } finally {
            setLoading(false)
        }
    }, [employeeID, month, session])

    useEffect(() => {
        if (open) {
            loadExtraInfos()
        }
    }, [open, loadExtraInfos])

    const handleDeleteClick = (extraInfo: SalaryExtraInfo) => {
        setExtraInfoToDelete(extraInfo)
        setShowDeleteConfirm(true)
    }

    const handleDeleteConfirm = async () => {
        if (!extraInfoToDelete || !session) return
        try {
            await deleteSalaryExtraInfo(employeeID, month, extraInfoToDelete.id, session)
            toast.success("Informasi tambahan berhasil dihapus")
            setShowDeleteConfirm(false)
            setExtraInfoToDelete(null)
            await loadExtraInfos()
            await onSuccess?.()
        } catch (error) {
            console.error("Failed to delete extra info:", error)
            toast.error("Gagal menghapus informasi tambahan")
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Hapus Informasi Tambahan</DialogTitle>
                        <DialogDescription>
                            Pilih informasi tambahan yang ingin dihapus.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        {loading ? (
                            <div className="text-center text-muted-foreground py-8">
                                Memuat informasi tambahan...
                            </div>
                        ) : (
                            <ExtraInfosTable
                                extraInfos={extraInfos}
                                onDelete={handleDeleteClick}
                                emptyMessage="Belum ada informasi tambahan untuk karyawan ini pada bulan ini"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <DeleteExtraInfoDialog
                open={showDeleteConfirm}
                onOpenChange={setShowDeleteConfirm}
                extraInfo={extraInfoToDelete}
                onConfirm={handleDeleteConfirm}
                title="Hapus Informasi Tambahan"
                description="Apakah Anda yakin ingin menghapus informasi tambahan ini? Tindakan ini tidak dapat dibatalkan."
            />
        </>
    )
}
