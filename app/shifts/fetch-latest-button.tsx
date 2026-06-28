"use client"

import { useShiftDumpStatus } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import { UpdateIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function FetchLatestButton(): React.ReactElement {
    const { isDumping, isLoading, isStarting, fetchLatest } =
        useShiftDumpStatus()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    const disabled = isDumping || isStarting || isLoading

    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={async () => {
                try {
                    await fetchLatest()
                    toast.success(
                        "Pengambilan data shift terbaru dimulai. Proses ini biasanya selesai dalam beberapa detik.",
                    )
                } catch {
                    toast.error("Gagal memulai pengambilan data terbaru")
                }
            }}
        >
            <UpdateIcon className="w-4 h-4 mr-2" />
            Ambil Data Terbaru
        </Button>
    )
}
