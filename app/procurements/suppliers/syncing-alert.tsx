"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSupplierDumpStatus } from "@/lib/api/hooks"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"

export default function SyncingAlert(): React.ReactElement {
    const { isDumping } = useSupplierDumpStatus()

    if (!isDumping) {
        return <></>
    }

    return (
        <Alert className="mt-4 border-yellow-500/50 text-yellow-700 dark:text-yellow-500 [&>svg]:text-yellow-700 dark:[&>svg]:text-yellow-500">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <AlertTitle>Sedang menyinkronkan supplier</AlertTitle>
            <AlertDescription>
                Data supplier sedang diambil dari Vmedis dan biasanya selesai
                dalam beberapa detik. Daftar akan diperbarui otomatis setelah
                proses selesai.
            </AlertDescription>
        </Alert>
    )
}
