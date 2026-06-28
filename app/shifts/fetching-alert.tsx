"use client"

import { useShiftDumpStatus } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function FetchingAlert(): React.ReactElement {
    const { isDumping } = useShiftDumpStatus()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode || !isDumping) {
        return <></>
    }

    return (
        <Alert className="mt-4 border-yellow-500/50 text-yellow-700 dark:text-yellow-500 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-500">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <AlertTitle>Sedang mengambil data terbaru</AlertTitle>
            <AlertDescription>
                Data shift terbaru sedang diambil dan biasanya selesai dalam
                beberapa detik. Tabel akan diperbarui otomatis setelah proses
                selesai.
            </AlertDescription>
        </Alert>
    )
}
