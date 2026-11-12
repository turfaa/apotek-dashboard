"use client"

import { Button } from "@/components/ui/button"
import { useSupplierDumpStatus } from "@/lib/api/hooks"
import { UpdateIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

export default function SyncButton(): React.ReactElement {
    const { isDumping, isLoading, isStarting, sync } = useSupplierDumpStatus()

    // Only one sync can run at a time, so the button stays disabled while
    // any sync is running, including ones started by other users.
    const disabled = isDumping || isStarting || isLoading

    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={async () => {
                try {
                    await sync()
                    toast.success(
                        "Sinkronisasi supplier dimulai. Proses ini biasanya selesai dalam beberapa detik.",
                    )
                } catch {
                    toast.error(
                        "Gagal memulai sinkronisasi supplier. Mungkin sinkronisasi lain sedang berjalan.",
                    )
                }
            }}
        >
            <UpdateIcon
                className={`w-4 h-4 mr-2${isDumping ? " animate-spin" : ""}`}
            />
            {isDumping ? "Menyinkronkan..." : "Sinkronkan dari Vmedis"}
        </Button>
    )
}
