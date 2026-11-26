"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Download, FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    SalarySlipError,
    downloadSalarySlipPdf,
    downloadSalarySlipsZip,
} from "@/lib/api/salary"

// Download buttons for pay slips (slip gaji) rendered by HRIS from salary
// snapshots.

const errorTitle = "Gagal membuat slip gaji"

function describeSlipError(error: unknown, kind: "pdf" | "zip"): string {
    if (error instanceof SalarySlipError) {
        switch (error.status) {
            case 503:
                return "Data apotek untuk kop surat belum diatur. Hubungi pengelola sistem."
            case 404:
                return kind === "pdf"
                    ? "Snapshot tidak ditemukan atau sudah dihapus. Muat ulang halaman."
                    : "Tidak ada snapshot gaji untuk bulan ini. Muat ulang halaman."
            case 401:
                return "Anda tidak memiliki akses. Silakan masuk kembali."
        }

        return `Terjadi kesalahan di server (${error.status}). Silakan coba lagi.`
    }

    return "Server tidak dapat dihubungi. Silakan coba lagi."
}

// Runs a download, with the button disabled while it runs and a toast when it
// fails.
function useDownload(kind: "pdf" | "zip", download: () => Promise<void>) {
    const [pending, setPending] = useState(false)

    async function run(): Promise<void> {
        if (pending) return

        setPending(true)
        try {
            await download()
        } catch (error) {
            console.error("Failed to download salary slip:", error)
            toast.error(errorTitle, { description: describeSlipError(error, kind) })
        } finally {
            setPending(false)
        }
    }

    return { pending, run }
}

interface SlipPdfButtonProps {
    snapshotID: number
    // "icon": the row action of the snapshot list; "label": "Unduh PDF".
    variant: "icon" | "label"
}

export function SlipPdfButton({ snapshotID, variant }: SlipPdfButtonProps): React.ReactElement {
    const { pending, run } = useDownload("pdf", () => downloadSalarySlipPdf(snapshotID))
    const icon = pending ? <Loader2 className="animate-spin" /> : <FileDown />

    if (variant === "icon") {
        return (
            <Button
                variant="outline"
                size="sm"
                onClick={run}
                disabled={pending}
                title="Unduh Slip Gaji (PDF)"
                aria-label="Unduh Slip Gaji (PDF)"
            >
                {icon}
            </Button>
        )
    }

    return (
        <Button onClick={run} disabled={pending}>
            {icon}
            {pending ? "Menyiapkan PDF…" : "Unduh PDF"}
        </Button>
    )
}

interface SlipsZipButtonProps {
    // YYYY-MM.
    month?: string
    employeeID?: number
    disabled?: boolean
}

export function SlipsZipButton({ month, employeeID, disabled }: SlipsZipButtonProps): React.ReactElement {
    const { pending, run } = useDownload("zip", async () => {
        if (month) await downloadSalarySlipsZip(month, employeeID)
    })

    return (
        <Button size="sm" onClick={run} disabled={disabled || !month || pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Download />}
            {pending ? "Menyiapkan ZIP…" : "Unduh Semua Slip (ZIP)"}
        </Button>
    )
}
