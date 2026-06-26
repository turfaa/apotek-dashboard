"use client"

import { useProcurementRecommendationStatus } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function GeneratingAlert(): React.ReactElement {
    const { isGenerating } = useProcurementRecommendationStatus()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode || !isGenerating) {
        return <></>
    }

    return (
        <Alert className="mt-4 border-yellow-500/50 text-yellow-700 dark:text-yellow-500 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-500">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <AlertTitle>Sedang membuat rekomendasi pesanan</AlertTitle>
            <AlertDescription>
                Rekomendasi pesanan sedang dibuat dan bisa memakan waktu hingga
                10 menit. Tombol &quot;Buat Rekomendasi&quot; akan tersedia lagi
                setelah proses selesai. Tekan &quot;Refresh&quot; untuk memuat
                hasil terbaru.
            </AlertDescription>
        </Alert>
    )
}
