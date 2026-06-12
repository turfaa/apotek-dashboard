"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteRejectedDrug } from "@/lib/api/rejected-drug"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export interface DeleteRejectedDrugButtonProps {
    rejectedDrugId: string
    redirectTo?: string
}

export function DeleteRejectedDrugButton({
    rejectedDrugId,
    redirectTo,
}: DeleteRejectedDrugButtonProps): React.ReactElement {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteRejectedDrug(Number(rejectedDrugId))

            toast.success("Obat tertolak berhasil dihapus")
            if (redirectTo) {
                router.push(redirectTo)
            }
            router.refresh()
        } catch (error) {
            toast.error("Gagal menghapus obat tertolak")
            console.error("Error deleting rejected drug:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Obat Tertolak</AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus catatan obat tertolak
                        ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
