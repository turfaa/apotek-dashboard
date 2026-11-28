"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { AlertTriangle, Landmark, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useBIFASTPreview } from "@/lib/api/hooks"
import {
    BIFASTIneligibleReason,
    BIFASTRow,
    SalaryApiError,
    downloadBIFASTFile,
} from "@/lib/api/salary"
import { rupiah } from "@/lib/rupiah"
import { useRupiahFormat } from "@/lib/rupiah-format-context"

// "Unduh File Transfer OCBC": a checklist of a month's snapshots, and the
// OCBC Business Non Bulk upload file (BI-FAST) paying the checked employees
// their snapshot's Total (after utang). HRIS makes the file and checks the
// selection again; the owner uploads and authorizes it in OCBC Business.

const reasonLabels: Record<BIFASTIneligibleReason, string> = {
    missing_bank_account: "Data rekening belum diisi",
    non_positive_total: "Total Rp0 atau kurang",
    bank_not_participant: "Bank tidak ada di daftar BI-FAST OCBC",
}

function describeError(error: unknown): string {
    if (error instanceof SalaryApiError) {
        switch (error.status) {
            case 503:
                return "Pengaturan transfer OCBC belum diisi. Hubungi pengelola sistem."
            case 404:
                return "Tidak ada snapshot gaji untuk bulan ini. Muat ulang halaman."
            case 409:
                return "Ada karyawan dengan lebih dari satu snapshot gaji bulan ini. Hapus snapshot yang berlebih terlebih dahulu."
            case 422:
                return "Sebagian karyawan yang dipilih tidak dapat ditransfer. Daftar sudah dimuat ulang; periksa lagi."
            case 401:
                return "Anda tidak memiliki akses. Silakan masuk kembali."
        }

        return `Terjadi kesalahan di server (${error.status}). Silakan coba lagi.`
    }

    return "Server tidak dapat dihubungi. Silakan coba lagi."
}

interface BIFASTDownloadButtonProps {
    // YYYY-MM.
    month?: string
    // The page's "Karyawan (Opsional)" filter: the dialog covers only them.
    employeeID?: number
    disabled?: boolean
}

export function BIFASTDownloadButton({ month, employeeID, disabled }: BIFASTDownloadButtonProps): React.ReactElement {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button size="sm" variant="outline" onClick={() => setOpen(true)} disabled={disabled || !month}>
                <Landmark />
                Unduh File Transfer OCBC
            </Button>
            {month && (
                <BIFASTDownloadDialog open={open} onOpenChange={setOpen} month={month} employeeID={employeeID} />
            )}
        </>
    )
}

interface BIFASTDownloadDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    month: string
    employeeID?: number
}

function BIFASTDownloadDialog({ open, onOpenChange, month, employeeID }: BIFASTDownloadDialogProps): React.ReactElement {
    const { format: rupiahFormat } = useRupiahFormat()
    const { data: preview, error, isLoading, mutate } = useBIFASTPreview(open ? month : undefined, employeeID)

    // Unchecked eligible employees. Every eligible employee starts checked.
    const [unchecked, setUnchecked] = useState<Set<number>>(new Set())
    const [downloading, setDownloading] = useState(false)

    const handleOpenChange = (next: boolean) => {
        if (downloading) return
        if (!next) setUnchecked(new Set())
        onOpenChange(next)
    }

    const rows = preview?.rows ?? []
    const eligible = rows.filter((row) => row.eligible)
    const selected = eligible.filter((row) => !unchecked.has(row.employeeID))
    const total = selected.reduce((sum, row) => sum + row.amount, 0)
    const blocked = (preview?.duplicates.length ?? 0) > 0
    const allChecked = eligible.length > 0 && selected.length === eligible.length

    const toggle = (employeeID: number, checked: boolean) => {
        const next = new Set(unchecked)
        if (checked) next.delete(employeeID)
        else next.add(employeeID)
        setUnchecked(next)
    }

    const toggleAll = (checked: boolean) => {
        setUnchecked(checked ? new Set() : new Set(eligible.map((row) => row.employeeID)))
    }

    const handleDownload = async () => {
        if (!preview || blocked || selected.length === 0 || downloading) return

        setDownloading(true)
        try {
            await downloadBIFASTFile(month, selected.map((row) => row.employeeID))
            toast.success("File transfer OCBC diunduh", {
                description: `${selected.length} transfer, total ${rupiah.format(total, rupiahFormat)}. Unggah di OCBC Business → Transaction → File Upload → Non Bulk File Upload.`,
            })
            setUnchecked(new Set())
            onOpenChange(false)
        } catch (err) {
            console.error("Failed to download BI-FAST file:", err)
            toast.error("Gagal membuat file transfer OCBC", { description: describeError(err) })
            await mutate()
        } finally {
            setDownloading(false)
        }
    }

    const monthDisplay = format(new Date(month + "-01"), "MMMM yyyy", { locale: id })

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Unduh File Transfer OCBC</DialogTitle>
                    <DialogDescription>
                        Gaji {monthDisplay} · BI-FAST, Non Bulk File Upload. Nominal transfer = Total (setelah utang).
                    </DialogDescription>
                </DialogHeader>

                {isLoading || (!preview && !error) ? (
                    <p className="text-sm text-muted-foreground flex items-center gap-2 py-6">
                        <Loader2 className="h-4 w-4 animate-spin" /> Memuat daftar transfer...
                    </p>
                ) : error || !preview ? (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {error instanceof SalaryApiError && error.status === 503
                                ? "Pengaturan transfer OCBC belum diisi. Hubungi pengelola sistem."
                                : describeError(error)}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <div className="flex flex-col gap-4">
                        {blocked && (
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Ada snapshot ganda</AlertTitle>
                                <AlertDescription>
                                    <p>
                                        Karyawan berikut punya lebih dari satu snapshot gaji di bulan ini, jadi file
                                        tidak bisa dibuat agar tidak ada gaji yang terbayar dua kali:
                                    </p>
                                    <ul className="list-disc pl-5">
                                        {preview.duplicates.map((d) => (
                                            <li key={d.employeeID}>
                                                {d.employeeName} ({d.count} snapshot)
                                            </li>
                                        ))}
                                    </ul>
                                    <p>Hapus snapshot yang berlebih di daftar, lalu buka lagi dialog ini.</p>
                                </AlertDescription>
                            </Alert>
                        )}

                        {rows.length > 0 && (
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-10">
                                                <Checkbox
                                                    checked={allChecked}
                                                    onCheckedChange={(checked) => toggleAll(checked === true)}
                                                    disabled={downloading || blocked || eligible.length === 0}
                                                    aria-label="Pilih semua"
                                                />
                                            </TableHead>
                                            <TableHead>Karyawan</TableHead>
                                            <TableHead>Bank</TableHead>
                                            <TableHead className="whitespace-nowrap">No. Rekening</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TransferRow
                                                key={row.employeeID}
                                                row={row}
                                                checked={row.eligible && !unchecked.has(row.employeeID)}
                                                onToggle={toggle}
                                                disabled={downloading || blocked}
                                                rupiahFormat={rupiahFormat}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        <dl className="rounded-lg bg-muted px-4 py-3 text-sm grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                            <dt className="text-muted-foreground">Tanggal transfer</dt>
                            <dd>{format(new Date(preview.valueDate + "T00:00:00"), "EEEE, d MMMM yyyy", { locale: id })}</dd>
                            <dt className="text-muted-foreground">Rekening debit</dt>
                            <dd className="font-mono">OCBC {preview.debitAccountNo}</dd>
                            <dt className="text-muted-foreground">Dipilih</dt>
                            <dd>
                                {selected.length} dari {rows.length} karyawan
                            </dd>
                            <dt className="text-muted-foreground">Total transfer</dt>
                            <dd className="font-semibold">{rupiah.format(total, rupiahFormat)}</dd>
                        </dl>
                        <p className="text-xs text-muted-foreground">
                            Setelah diunggah, periksa total di pratinjau OCBC sama dengan Total transfer di atas sebelum
                            mengotorisasi. OCBC menolak transfer gaji yang sama dua kali.
                        </p>
                    </div>
                )}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={downloading}>
                        Batal
                    </Button>
                    {preview && (
                        <Button onClick={handleDownload} disabled={downloading || blocked || selected.length === 0}>
                            {downloading && <Loader2 className="animate-spin" />}
                            {downloading ? "Menyiapkan file…" : `Unduh .txt (${selected.length} transfer)`}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface TransferRowProps {
    row: BIFASTRow
    checked: boolean
    onToggle: (employeeID: number, checked: boolean) => void
    disabled: boolean
    rupiahFormat: ReturnType<typeof useRupiahFormat>["format"]
}

function TransferRow({ row, checked, onToggle, disabled, rupiahFormat }: TransferRowProps): React.ReactElement {
    const inputID = `bifast-${row.employeeID}`
    const fixableOnEmployee = row.reason === "missing_bank_account" || row.reason === "bank_not_participant"

    return (
        <TableRow className={row.eligible ? undefined : "text-muted-foreground"}>
            <TableCell>
                <Checkbox
                    id={inputID}
                    checked={checked}
                    onCheckedChange={(next) => onToggle(row.employeeID, next === true)}
                    disabled={disabled || !row.eligible}
                    aria-label={`Pilih ${row.employeeName}`}
                />
            </TableCell>
            <TableCell className="font-medium">
                <label htmlFor={inputID} className="block">
                    {row.employeeName}
                </label>
                {row.reason && (
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="outline" className="border-orange-300 text-orange-800 dark:text-orange-200">
                            {reasonLabels[row.reason]}
                        </Badge>
                        {fixableOnEmployee && (
                            <Link className="text-xs underline" href={`/employees/${row.employeeID}/edit`}>
                                Isi di data karyawan
                            </Link>
                        )}
                    </div>
                )}
            </TableCell>
            <TableCell>{row.bankName || (row.bankBIC ? row.bankBIC : "—")}</TableCell>
            <TableCell className="font-mono whitespace-nowrap">{row.accountNumber || "—"}</TableCell>
            <TableCell className="text-right whitespace-nowrap">{rupiah.format(row.amount, rupiahFormat)}</TableCell>
        </TableRow>
    )
}
