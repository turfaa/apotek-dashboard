"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, RefreshCw } from "lucide-react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
    CreateErrorMessage,
    describeCreateError,
    useCreateAndDownload,
} from "@/components/purchase-order-letter/create"
import {
    CreatorSelect,
    LetterItemsTable,
    SignatureCheckbox,
} from "@/components/purchase-order-letter/fields"
import { usePurchaseOrderLetter, useSuppliers } from "@/lib/api/hooks"
import {
    PurchaseOrderLetterDetail,
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterSigner,
    PurchaseOrderLetterSummary,
} from "@/lib/api/purchase-order-letter"

export interface DuplicateDialogProps {
    // The SP to duplicate; the dialog is closed when undefined.
    summary?: PurchaseOrderLetterSummary
    onOpenChange: (open: boolean) => void
    signer?: PurchaseOrderLetterSigner
    // Null when HRIS could not be read.
    employees: PurchaseOrderLetterEmployee[] | null
}

// Re-orders the items of a stored SP as a new SP, dated now with the next
// number. It sends the original's template, supplier and items to the normal
// create endpoint; the original is untouched and not linked.
export function DuplicateDialog({
    summary,
    onOpenChange,
    signer,
    employees,
}: DuplicateDialogProps): React.ReactElement {
    const { data: detail, error } = usePurchaseOrderLetter(summary?.id)

    return (
        <Dialog open={!!summary} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Duplikat Surat Pesanan</DialogTitle>
                    <DialogDescription>
                        Surat pesanan baru dibuat dari {summary?.number} dengan
                        tanggal hari ini dan nomor baru. Surat pesanan lama tidak
                        berubah.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Terjadi Kesalahan</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}

                {!error && !detail && (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-9 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}

                {/* Keyed by SP, so each opening starts from the original's choices. */}
                {detail && summary && detail.id === summary.id && (
                    <DuplicateForm
                        key={detail.id}
                        detail={detail}
                        signer={signer}
                        employees={employees}
                        onDone={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}

interface DuplicateFormProps {
    detail: PurchaseOrderLetterDetail
    signer?: PurchaseOrderLetterSigner
    employees: PurchaseOrderLetterEmployee[] | null
    onDone: () => void
}

function DuplicateForm({
    detail,
    signer,
    employees,
    onDone,
}: DuplicateFormProps): React.ReactElement {
    const router = useRouter()
    const createAndDownload = useCreateAndDownload()

    // The new SP takes the supplier's current details, not the old SP's
    // snapshot, so show those.
    const suppliers = useSuppliers()
    const supplier = suppliers.data?.suppliers.find(
        (s) => s.vmedisId === detail.supplier.vmedisId,
    )
    const supplierGone = !!suppliers.data && !supplier

    // One key per dialog opening, so "Coba lagi" after a lost response gets
    // the SP already made instead of a second one.
    const [idempotencyKey] = useState(() => crypto.randomUUID())
    const [includeSignature, setIncludeSignature] = useState(
        detail.includePharmacistSignature,
    )
    const [creatorId, setCreatorId] = useState<number | null>(null)
    const [showRequired, setShowRequired] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<CreateErrorMessage>()

    const creator = employees?.find((e) => e.id === creatorId)

    const submit = async () => {
        if (!creator) {
            setShowRequired(true)
            return
        }

        setIsSubmitting(true)
        setSubmitError(undefined)
        try {
            await createAndDownload(
                {
                    idempotencyKey,
                    templateId: detail.templateId,
                    supplierVmedisId: detail.supplier.vmedisId,
                    includePharmacistSignature: includeSignature,
                    createdByEmployee: creator,
                    items: detail.items.map((item) => ({
                        drugVmedisCode: item.drugVmedisCode,
                        drugName: item.drugName,
                        quantity: item.quantity,
                    })),
                },
                { showHistoryLink: false },
            )
            onDone()
            // Show the new SP at the top of the list.
            router.refresh()
        } catch (error) {
            setSubmitError(describeCreateError(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-muted-foreground">Supplier</dt>
                    <dd className="mt-0.5 font-medium">
                        {supplier?.name ?? detail.supplier.name}
                    </dd>
                    <dd className="mt-0.5 text-muted-foreground">
                        {suppliers.isLoading ? (
                            <Skeleton className="h-4 w-40" />
                        ) : supplier ? (
                            [supplier.address, supplier.city]
                                .filter((part) => part.trim())
                                .join(", ") ||
                            "Alamat kosong, baris alamat dikosongkan"
                        ) : null}
                    </dd>
                </div>
                <div>
                    <dt className="text-muted-foreground">Template</dt>
                    <dd className="mt-0.5 font-medium">{detail.templateName}</dd>
                </div>
            </dl>

            {supplierGone && (
                <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Supplier tidak ditemukan</AlertTitle>
                    <AlertDescription>
                        {detail.supplier.name} tidak ada lagi di daftar supplier.
                        Sinkronkan data supplier di Daftar Supplier, lalu coba
                        lagi.
                    </AlertDescription>
                </Alert>
            )}

            {employees ? (
                <CreatorSelect
                    employees={employees}
                    value={creatorId}
                    onChange={setCreatorId}
                    error={
                        showRequired && !creator ? "Pilih karyawan dulu." : undefined
                    }
                />
            ) : (
                <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Gagal memuat daftar karyawan</AlertTitle>
                    <AlertDescription>
                        Muat ulang halaman, lalu coba lagi.
                    </AlertDescription>
                </Alert>
            )}

            <SignatureCheckbox
                checked={includeSignature}
                onChange={setIncludeSignature}
                signer={signer}
            />

            <div className="rounded-md border">
                <LetterItemsTable items={detail.items} />
            </div>

            {submitError && (
                <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>{submitError.title}</AlertTitle>
                    <AlertDescription>{submitError.description}</AlertDescription>
                </Alert>
            )}

            <DialogFooter className="gap-2">
                <Button variant="outline" onClick={onDone} disabled={isSubmitting}>
                    Batal
                </Button>
                <Button
                    onClick={submit}
                    disabled={isSubmitting || !employees || supplierGone}
                >
                    {submitError ? (
                        <RefreshCw className="mr-2 h-4 w-4" />
                    ) : (
                        <Copy className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting
                        ? "Membuat..."
                        : submitError
                            ? "Coba lagi"
                            : "Duplikat & Buat PDF"}
                </Button>
            </DialogFooter>
        </div>
    )
}
