"use client"

import { useProcurementRecommendationStatus } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import { UpdateIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function GenerateButton(): React.ReactElement {
    const { isGenerating, isLoading, isStarting, generate } =
        useProcurementRecommendationStatus()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    const disabled = isGenerating || isStarting || isLoading

    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={async () => {
                try {
                    await generate()
                    toast.success(
                        "Pembuatan rekomendasi pesanan dimulai. Proses ini bisa memakan waktu hingga 10 menit.",
                    )
                } catch {
                    toast.error("Gagal memulai pembuatan rekomendasi pesanan")
                }
            }}
        >
            <UpdateIcon className="w-4 h-4 mr-2" />
            Buat Rekomendasi
        </Button>
    )
}
