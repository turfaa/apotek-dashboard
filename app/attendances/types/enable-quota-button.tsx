"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
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
import {
    AttendanceType,
    enableAttendanceTypeQuota,
} from "@/lib/api/attendance"
import { toast } from "sonner"

interface EnableQuotaButtonProps {
    attendanceType: AttendanceType
}

export function EnableQuotaButton({ attendanceType }: EnableQuotaButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleEnableQuota() {
        setLoading(true)
        try {
            await enableAttendanceTypeQuota(attendanceType.id)
            toast.success(
                `Kuota berhasil diaktifkan untuk "${attendanceType.name}"`,
            )
            router.refresh()
        } catch (error) {
            toast.error("Gagal mengaktifkan kuota")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                    Aktifkan Kuota
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Aktifkan Kuota?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda akan mengaktifkan kuota untuk jenis kehadiran
                        &quot;{attendanceType.name}&quot;. Perubahan ini tidak
                        dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleEnableQuota}
                        disabled={loading}
                    >
                        {loading ? "Mengaktifkan..." : "Aktifkan"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
