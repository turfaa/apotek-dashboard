"use client"

import { useId, useState } from "react"
import { useRouter } from "next/navigation"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { mutate } from "swr"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreatorSelect } from "@/components/purchase-order-letter/fields"
import {
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterError,
    PurchaseOrderLetterSummary,
    cancelPurchaseOrderLetter,
} from "@/lib/api/purchase-order-letter"

const maxReasonLength = 500

export interface CancelDialogProps {
    // The SP to cancel; the dialog is closed when undefined.
    summary?: PurchaseOrderLetterSummary
    onOpenChange: (open: boolean) => void
    // Null when HRIS could not be read.
    employees: PurchaseOrderLetterEmployee[] | null
}

// Batalkan SP: marks an SP as cancelled, with a reason and the employee who
// cancels it. The SP stays in Riwayat with its number, and its PDF gets a
// DIBATALKAN watermark. It can't be undone.
export function CancelDialog({
    summary,
    onOpenChange,
    employees,
}: CancelDialogProps): React.ReactElement {
    return (
        <AlertDialog open={!!summary} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[520px]">
                {/* Keyed by SP, so each opening starts empty. */}
                {summary && (
                    <CancelForm
                        key={summary.id}
                        summary={summary}
                        employees={employees}
                        onDone={() => onOpenChange(false)}
                    />
                )}
            </AlertDialogContent>
        </AlertDialog>
    )
}

interface CancelFormProps {
    summary: PurchaseOrderLetterSummary
    employees: PurchaseOrderLetterEmployee[] | null
    onDone: () => void
}

function CancelForm({ summary, employees, onDone }: CancelFormProps): React.ReactElement {
    const router = useRouter()
    const reasonId = useId()
    const [reason, setReason] = useState("")
    const [employeeId, setEmployeeId] = useState<number | null>(null)
    const [showRequired, setShowRequired] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>()

    const employee = employees?.find((e) => e.id === employeeId)
    const trimmedReason = reason.trim()

    const submit = async () => {
        if (!trimmedReason || !employee) {
            setShowRequired(true)
            return
        }

        setIsSubmitting(true)
        setError(undefined)
        try {
            const detail = await cancelPurchaseOrderLetter(summary.id, {
                reason: trimmedReason,
                cancelledByEmployee: employee,
            })
            await mutate(`/v1/procurements/purchase-orders/${summary.id}`, detail, {
                revalidate: false,
            })
            toast.success(`Surat pesanan ${summary.number} dibatalkan`, {
                description: "Tandai lembar yang sudah dicetak sebagai batal, lalu arsipkan.",
            })
            onDone()
            router.refresh()
        } catch (err) {
            if (err instanceof PurchaseOrderLetterError && err.status === 409) {
                toast.info(`Surat pesanan ${summary.number} sudah dibatalkan`)
                await mutate(`/v1/procurements/purchase-orders/${summary.id}`)
                onDone()
                router.refresh()
                return
            }

            setError(
                err instanceof PurchaseOrderLetterError && err.status < 500
                    ? err.message
                    : "Server tidak dapat dihubungi atau terjadi kesalahan. Silakan coba lagi.",
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <AlertDialogHeader>
                <AlertDialogTitle>Batalkan SP {summary.number}?</AlertDialogTitle>
                <AlertDialogDescription>
                    SP tetap disimpan di riwayat dan nomornya tidak dipakai lagi.
                    PDF-nya akan diberi tanda DIBATALKAN. Lembar yang sudah
                    dicetak juga ditandai batal, lalu diarsipkan bersama SP lain.
                    Pembatalan tidak bisa diurungkan.
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor={reasonId}>Alasan pembatalan</Label>
                    <Textarea
                        id={reasonId}
                        rows={3}
                        value={reason}
                        maxLength={maxReasonLength}
                        onChange={(event) => setReason(event.target.value)}
                        aria-invalid={showRequired && !trimmedReason}
                        className="resize-none"
                    />
                    {showRequired && !trimmedReason && (
                        <p className="text-xs text-destructive">Isi alasan pembatalan.</p>
                    )}
                </div>

                {employees ? (
                    <CreatorSelect
                        label="Dibatalkan oleh"
                        employees={employees}
                        value={employeeId}
                        onChange={setEmployeeId}
                        error={showRequired && !employee ? "Pilih karyawan dulu." : undefined}
                    />
                ) : (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Gagal memuat daftar karyawan</AlertTitle>
                        <AlertDescription>Muat ulang halaman, lalu coba lagi.</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Gagal membatalkan surat pesanan</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>

            <AlertDialogFooter>
                <AlertDialogCancel disabled={isSubmitting}>Kembali</AlertDialogCancel>
                {/* A plain button, so the dialog stays open while it submits. */}
                <Button
                    variant="destructive"
                    disabled={isSubmitting || !employees}
                    onClick={submit}
                >
                    {isSubmitting ? "Membatalkan..." : "Batalkan SP"}
                </Button>
            </AlertDialogFooter>
        </>
    )
}
