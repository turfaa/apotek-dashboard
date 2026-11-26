"use client"

import { Suspense, use, useCallback, useId, useState } from "react"
import { ChevronDown, Download, RefreshCw } from "lucide-react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
    describeCreateError,
    useCreateAndDownload,
    CreateErrorMessage,
} from "@/components/purchase-order-letter/create"
import {
    CreatorSelect,
    LetterItemsTable,
    SignatureCheckbox,
} from "@/components/purchase-order-letter/fields"
import { SupplierCombobox } from "@/components/purchase-order-letter/supplier-combobox"
import {
    usePurchaseOrderLetterItemDetails,
    usePurchaseOrderLetterOptions,
    useSupplierDumpStatus,
    useSuppliers,
} from "@/lib/api/hooks"
import {
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterItemInput,
    PurchaseOrderLetterSigner,
    PurchaseOrderLetterTemplate,
    hasWetSignature,
    isControlledTemplate,
    refreshPurchaseOrderLetterItemDetails,
} from "@/lib/api/purchase-order-letter"
import {
    ControlledItemValues,
    golonganWarning,
    hasErrors,
    isCompleteInVmedis,
    prefillControlledItem,
    validateControlledItem,
} from "@/lib/purchase-order-letter-items"
import { Supplier } from "@/lib/api/supplier"
import { cn } from "@/lib/utils"
import {
    ControlledItemRow,
    ControlledItemsTable,
    MissingInVmedisNotice,
} from "./controlled-items-table"
import { Row, isVmedisDrug } from "./use-filtered-purchase-orders"

export interface PurchaseOrderLetterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    rows: Row[]
    query: string
    // Null when HRIS could not be read.
    employeesPromise: Promise<PurchaseOrderLetterEmployee[] | null>
}

export function PurchaseOrderLetterDialog({
    open,
    onOpenChange,
    rows,
    query,
    employeesPromise,
}: PurchaseOrderLetterDialogProps): React.ReactElement {
    const options = usePurchaseOrderLetterOptions(open)

    // The template picked in this opening; undefined means the first one.
    // Kept here, outside the body, because a controlled template widens the
    // dialog.
    const [pickedTemplateId, setPickedTemplateId] = useState<string>()
    const template =
        options.data?.templates.find((t) => t.id === pickedTemplateId) ??
        options.data?.templates[0]

    const handleOpenChange = (next: boolean) => {
        if (!next) setPickedTemplateId(undefined)
        onOpenChange(next)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    "max-h-[90vh] overflow-y-auto",
                    isControlledTemplate(template) ? "sm:max-w-4xl" : "sm:max-w-[560px]",
                )}
            >
                <DialogHeader>
                    <DialogTitle>Buat Surat Pesanan</DialogTitle>
                    <DialogDescription>
                        {rows.length} obat yang sedang ditampilkan akan
                        dimasukkan ke surat pesanan.
                    </DialogDescription>
                </DialogHeader>

                {/* Mounted only while open, so every opening starts fresh. */}
                {open && (
                    <Suspense fallback={<DialogBodyFallback />}>
                        <DialogBody
                            rows={rows}
                            query={query}
                            employeesPromise={employeesPromise}
                            template={template}
                            onTemplateChange={setPickedTemplateId}
                            onDone={() => handleOpenChange(false)}
                        />
                    </Suspense>
                )}
            </DialogContent>
        </Dialog>
    )
}

interface DialogBodyProps {
    rows: Row[]
    query: string
    employeesPromise: Promise<PurchaseOrderLetterEmployee[] | null>
    // Undefined while the options load.
    template?: PurchaseOrderLetterTemplate
    onTemplateChange: (templateId: string) => void
    onDone: () => void
}

function DialogBody({
    rows,
    query,
    employeesPromise,
    template,
    onTemplateChange,
    onDone,
}: DialogBodyProps): React.ReactElement {
    const employees = use(employeesPromise)
    const options = usePurchaseOrderLetterOptions()
    const suppliers = useSuppliers()
    const createAndDownload = useCreateAndDownload()
    const templateLabelId = useId()
    const supplierFieldId = useId()

    const activeSuppliers = (suppliers.data?.suppliers ?? []).filter(
        (s) => s.active,
    )

    // undefined until the operator picks one; until then, the pre-selection
    // applies.
    const [pickedSupplierId, setPickedSupplierId] = useState<
        number | null | undefined
    >(undefined)
    const supplierId =
        pickedSupplierId !== undefined
            ? pickedSupplierId
            : preselectSupplier(activeSuppliers, query, rows)
    const supplier = activeSuppliers.find((s) => s.vmedisId === supplierId)

    const templateId = template?.id
    const controlled = isControlledTemplate(template)
    const wetSignature = hasWetSignature(template)
    const items = useControlledItems(rows, controlled ? template : undefined)

    // One key per dialog opening, so "Coba lagi" after a lost response gets
    // the SP already made instead of a second one.
    const [idempotencyKey] = useState(() => crypto.randomUUID())
    const [includeSignature, setIncludeSignature] = useState(true)
    const [creatorId, setCreatorId] = useState<number | null>(null)
    const [showRequired, setShowRequired] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<CreateErrorMessage>()

    const invalidItems = describeInvalidItems(rows, controlled)
    const creator = employees?.find((e) => e.id === creatorId)

    const submit = async () => {
        if (!supplier || !creator || !templateId) {
            setShowRequired(true)
            return
        }

        setIsSubmitting(true)
        setSubmitError(undefined)
        try {
            await createAndDownload({
                idempotencyKey,
                templateId,
                supplierVmedisId: supplier.vmedisId,
                includePharmacistSignature: wetSignature || includeSignature,
                createdByEmployee: creator,
                items: controlled
                    ? items.requestItems()
                    : rows.map((row) => ({
                        drugVmedisCode: isVmedisDrug(row) ? row.vmedisCode : null,
                        drugName: row.name.trim(),
                        quantity: row.procurement.trim(),
                    })),
            })
            onDone()
        } catch (error) {
            setSubmitError(describeCreateError(error))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (options.error) {
        return (
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Surat pesanan belum bisa dibuat</AlertTitle>
                <AlertDescription>
                    Gagal memuat pengaturan surat pesanan. Mungkin surat
                    pesanan belum dikonfigurasi di server.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-col gap-2">
                <Label htmlFor={supplierFieldId}>Supplier</Label>
                {suppliers.isLoading ? (
                    <Skeleton className="h-9 w-full" />
                ) : (
                    <SupplierCombobox
                        id={supplierFieldId}
                        suppliers={activeSuppliers}
                        value={supplierId}
                        onChange={setPickedSupplierId}
                        aria-invalid={showRequired && !supplier}
                    />
                )}
                {supplier && <SupplierContact supplier={supplier} />}
                {suppliers.error && (
                    <p className="text-xs text-destructive">
                        Gagal memuat daftar supplier.
                    </p>
                )}
                {showRequired && !supplier && (
                    <p className="text-xs text-destructive">
                        Pilih supplier dulu.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label id={templateLabelId}>Template</Label>
                {options.data ? (
                    <Select
                        value={templateId}
                        onValueChange={onTemplateChange}
                    >
                        <SelectTrigger aria-labelledby={templateLabelId}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {options.data.templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                    {template.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Skeleton className="h-9 w-full" />
                )}
                {template && (
                    <p className="text-xs text-muted-foreground">
                        {template.description}
                    </p>
                )}
            </div>

            {employees ? (
                <CreatorSelect
                    employees={employees}
                    value={creatorId}
                    onChange={setCreatorId}
                    error={
                        showRequired && !creator
                            ? "Pilih karyawan dulu."
                            : undefined
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

            {wetSignature ? (
                <WetSignatureNote signer={options.data?.signer} />
            ) : (
                <SignatureCheckbox
                    checked={includeSignature}
                    onChange={setIncludeSignature}
                    signer={options.data?.signer}
                />
            )}

            {controlled ? (
                <>
                    {items.loadFailed && (
                        <LoadFailedNotice onRetry={items.reload} />
                    )}
                    {items.missingInVmedis.length > 0 && (
                        <MissingInVmedisNotice
                            drugs={items.missingInVmedis}
                            vmedisDrugPageUrl={options.data?.vmedisDrugPageUrl}
                            isRefreshing={items.isRefreshing}
                            onRefresh={items.refresh}
                        />
                    )}
                    <ControlledItemsTable
                        rows={items.rows}
                        isLoading={items.isLoading}
                        onChange={items.setValue}
                    />
                </>
            ) : (
                <ItemsPreview rows={rows} />
            )}

            {invalidItems.map((message) => (
                <Alert variant="destructive" key={message.title}>
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>{message.title}</AlertTitle>
                    <AlertDescription>{message.description}</AlertDescription>
                </Alert>
            ))}

            {supplier && !supplier.address.trim() && (
                <MissingAddressWarning
                    supplierName={supplier.name}
                    vmedisSupplierPageUrl={options.data?.vmedisSupplierPageUrl}
                    onSynced={suppliers.mutate}
                />
            )}

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
                    disabled={
                        isSubmitting ||
                        invalidItems.length > 0 ||
                        (controlled && !items.isReady) ||
                        !options.data ||
                        !employees
                    }
                >
                    {submitError ? (
                        <RefreshCw className="mr-2 h-4 w-4" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    {isSubmitting
                        ? "Membuat..."
                        : submitError
                            ? "Coba lagi"
                            : "Buat PDF"}
                </Button>
            </DialogFooter>
        </div>
    )
}

// Controlled templates always print the APJ's name and SIPA; the signature
// and stamp go on by hand.
function WetSignatureNote({
    signer,
}: {
    signer?: PurchaseOrderLetterSigner
}): React.ReactElement {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Tanda tangan</span>
            <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                Nama &amp; SIPA {signer ? `apt. ${signer.name}` : "Apoteker Penanggung Jawab"}{" "}
                dicetak. TTD dan stempel apotek dibubuhkan basah setelah
                dicetak.
            </p>
        </div>
    )
}

function LoadFailedNotice({ onRetry }: { onRetry: () => void }): React.ReactElement {
    return (
        <div
            role="status"
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50"
        >
            <span>
                Gagal memuat data obat dari server. Surat pesanan bisa dibuat
                setelah datanya termuat.
            </span>
            <Button variant="outline" size="sm" className="bg-background" onClick={onRetry}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Coba lagi
            </Button>
        </div>
    )
}

// The drug class a template is for, in the Golongan warning.
function templateClassName(template: PurchaseOrderLetterTemplate): string {
    switch (template.id) {
        case "prekursor":
            return "Prekursor"
        case "oot":
            return "OOT"
        default:
            return template.name
    }
}

interface ControlledItems {
    rows: ControlledItemRow[]
    // Drugs whose zat aktif or bentuk & kekuatan is empty in Vmedis.
    missingInVmedis: { key: string; name: string }[]
    isLoading: boolean
    loadFailed: boolean
    isRefreshing: boolean
    // Every item is in Vmedis, complete there, and valid.
    isReady: boolean
    setValue: (key: string, field: keyof ControlledItemValues, value: string) => void
    reload: () => void
    refresh: () => void
    requestItems: () => PurchaseOrderLetterItemInput[]
}

// The Rincian obat of a controlled template: Vmedis details of the rows'
// drugs and the operator's edits. Edits are kept while the dialog is open,
// even when the template is switched back and forth. Pass no template to
// skip loading the details.
function useControlledItems(
    rows: Row[],
    template: PurchaseOrderLetterTemplate | undefined,
): ControlledItems {
    const codes = rows.filter(isVmedisDrug).map((row) => row.vmedisCode)
    const details = usePurchaseOrderLetterItemDetails(template?.id, codes)
    const [edits, setEdits] = useState<Record<string, Partial<ControlledItemValues>>>({})
    const [isRefreshing, setIsRefreshing] = useState(false)

    const detailsByCode = new Map(
        (details.data ?? []).map((d) => [d.drugVmedisCode, d]),
    )

    const itemRows: ControlledItemRow[] = rows.map((row) => {
        const units = row.raw.drug.units.map((u) => ({
            unit: u.unit,
            parentUnit: u.parentUnit ?? "",
            conversionToParentUnit: u.conversionToParentUnit ?? 0,
        }))
        const values = {
            ...prefillControlledItem(row.procurement, units),
            ...edits[row.vmedisCode],
        }
        const inVmedis = isVmedisDrug(row)
        const rowDetails = inVmedis ? detailsByCode.get(row.vmedisCode) : undefined

        return {
            key: row.vmedisCode,
            drugName: row.name.trim() || row.vmedisCode,
            inVmedis,
            details: rowDetails,
            values,
            errors: validateControlledItem(values),
            golonganWarning: template
                ? golonganWarning(rowDetails, templateClassName(template))
                : undefined,
        }
    })

    const missingInVmedis = itemRows
        .filter((row) => row.inVmedis && row.details && !isCompleteInVmedis(row.details))
        .map((row) => ({ key: row.key, name: row.drugName }))

    const isLoading = codes.length > 0 && !details.data && !details.error
    const isReady =
        !isLoading &&
        !details.error &&
        itemRows.every(
            (row) => row.inVmedis && isCompleteInVmedis(row.details) && !hasErrors(row.errors),
        )

    const refresh = async () => {
        if (!template) return

        // The backend refreshes at most 50 drugs at once.
        const missingCodes = missingInVmedis.map((d) => d.key).slice(0, 50)
        setIsRefreshing(true)
        try {
            const refreshed = await refreshPurchaseOrderLetterItemDetails(template.id, missingCodes)
            const byCode = new Map(refreshed.map((d) => [d.drugVmedisCode, d]))
            await details.mutate(
                (current) => current?.map((d) => byCode.get(d.drugVmedisCode) ?? d),
                { revalidate: false },
            )

            const stillMissing = refreshed.filter((d) => !isCompleteInVmedis(d)).length
            if (stillMissing > 0) {
                toast.warning(`${stillMissing} obat masih belum lengkap di Vmedis`, {
                    description: "Pastikan data obat sudah disimpan di Vmedis, lalu muat ulang lagi.",
                })
            } else {
                toast.success("Data obat dimuat ulang dari Vmedis")
            }
        } catch {
            toast.error("Gagal memuat ulang dari Vmedis", {
                description: "Coba lagi sebentar lagi.",
            })
        } finally {
            setIsRefreshing(false)
        }
    }

    return {
        rows: itemRows,
        missingInVmedis,
        isLoading,
        loadFailed: !!details.error,
        isRefreshing,
        isReady,
        setValue: (key, field, value) =>
            setEdits((current) => ({
                ...current,
                [key]: { ...current[key], [field]: value },
            })),
        reload: () => void details.mutate(),
        refresh: () => void refresh(),
        requestItems: () =>
            itemRows.map((row) => ({
                drugVmedisCode: row.inVmedis ? row.key : null,
                drugName: row.drugName,
                quantity: row.values.quantity.trim(),
                smallestPackage: row.values.smallestPackage.trim(),
                note: row.values.note.trim() || null,
            })),
    }
}

function SupplierContact({ supplier }: { supplier: Supplier }): React.ReactElement {
    const address = [supplier.address, supplier.city]
        .map((part) => part.trim())
        .filter(Boolean)
        .join(", ")
    const phone = supplier.phone.trim() || supplier.mobilePhone.trim()

    return (
        <p className="text-xs text-muted-foreground">
            {address || "Alamat belum diisi"}
            {phone && ` · Telp. ${phone}`}
        </p>
    )
}

function ItemsPreview({ rows }: { rows: Row[] }): React.ReactElement {
    const [open, setOpen] = useState(false)

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="border-t pt-3">
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 font-medium"
                    aria-expanded={open}
                >
                    <ChevronDown
                        className={cn(
                            "mr-1 h-4 w-4 transition-transform",
                            !open && "-rotate-90",
                        )}
                    />
                    Daftar obat ({rows.length})
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <LetterItemsTable
                    items={rows.map((row) => ({
                        drugName: row.name,
                        quantity: row.procurement,
                    }))}
                />
            </CollapsibleContent>
        </Collapsible>
    )
}

interface MissingAddressWarningProps {
    supplierName: string
    vmedisSupplierPageUrl?: string
    onSynced: () => Promise<unknown>
}

// The SP can still be made without the supplier's address; this explains how
// to fill it in Vmedis and sync it back without leaving the dialog.
function MissingAddressWarning({
    supplierName,
    vmedisSupplierPageUrl,
    onSynced,
}: MissingAddressWarningProps): React.ReactElement {
    const onFinished = useCallback(() => {
        void onSynced()
    }, [onSynced])
    const { isDumping, isStarting, isLoading, sync } = useSupplierDumpStatus({
        onFinished,
    })
    const isSyncing = isDumping || isStarting

    return (
        <div
            role="status"
            className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50"
        >
            <p className="font-medium">Alamat supplier kosong</p>
            <p className="mt-1">
                Data supplier dari Vmedis belum punya alamat. Surat pesanan tetap
                bisa dibuat; baris alamat dikosongkan.
            </p>
            <div className="mt-3 flex flex-col gap-2 border-t border-amber-200 pt-3 dark:border-amber-800">
                <span className="font-medium">Cara melengkapi alamat</span>
                <span>
                    1. Buka{" "}
                    {vmedisSupplierPageUrl ? (
                        <a
                            href={vmedisSupplierPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium underline underline-offset-2"
                        >
                            Data Supplier di Vmedis
                        </a>
                    ) : (
                        "Data Supplier di Vmedis"
                    )}
                    , cari {supplierName}, lalu isi alamat dan nomor teleponnya.
                </span>
                <span>
                    2. Kembali ke sini, lalu sinkronkan data supplier dari Vmedis
                    agar alamat terisi di surat pesanan.
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    className="self-start bg-background"
                    disabled={isSyncing || isLoading}
                    onClick={async () => {
                        try {
                            await sync()
                        } catch {
                            toast.error("Gagal memulai sinkronisasi supplier")
                        }
                    }}
                >
                    <RefreshCw
                        className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")}
                    />
                    {isSyncing ? "Menyinkronkan..." : "Sinkronkan data supplier"}
                </Button>
            </div>
        </div>
    )
}

interface InvalidItemsMessage {
    title: string
    description: string
}

function describeInvalidItems(rows: Row[], controlled: boolean): InvalidItemsMessage[] {
    const messages: InvalidItemsMessage[] = []

    if (controlled) {
        const manual = rows.filter((row) => !isVmedisDrug(row))
        if (manual.length > 0) {
            messages.push({
                title: `${manual.length} obat tidak ada di Vmedis`,
                description: `${manual.map((row) => row.name.trim() || row.vmedisCode).join(", ")}. Obat yang ditambahkan manual tidak bisa masuk surat pesanan Prekursor atau OOT. Cari obat lain agar obat ini tidak tampil, atau hapus dari tabel.`,
            })
        }
    }

    // Controlled templates take the quantity from Rincian obat instead.
    const withoutQuantity = controlled ? [] : rows.filter((row) => !row.procurement.trim())
    if (withoutQuantity.length > 0) {
        messages.push({
            title: `${withoutQuantity.length} obat belum diisi jumlahnya`,
            description: `${withoutQuantity.map((row) => row.name.trim() || row.vmedisCode).join(", ")}. Isi kolom Jumlah di tabel, lalu coba lagi.`,
        })
    }

    const withoutName = rows.filter((row) => !row.name.trim())
    if (withoutName.length > 0) {
        messages.push({
            title: `${withoutName.length} obat belum diisi namanya`,
            description: `Baris nomor ${withoutName.map((row) => rows.indexOf(row) + 1).join(", ")}. Isi kolom Nama Obat di tabel, lalu coba lagi.`,
        })
    }

    return messages
}

// Pre-selects the supplier whose name exactly matches the search text, or
// else the Supplier value shared by every shown row (case-insensitive,
// trimmed), when exactly one supplier matches.
export function preselectSupplier(
    suppliers: Supplier[],
    query: string,
    rows: Row[],
): number | null {
    const normalize = (s: string) => s.trim().toLowerCase()
    const findOnly = (name: string): number | null => {
        const matches = suppliers.filter((s) => normalize(s.name) === name)
        return matches.length === 1 ? matches[0].vmedisId : null
    }

    const byQuery = normalize(query) ? findOnly(normalize(query)) : null
    if (byQuery !== null) return byQuery

    const rowSuppliers = new Set(rows.map((row) => normalize(row.supplier)))
    if (rowSuppliers.size === 1) {
        const [name] = rowSuppliers
        if (name) return findOnly(name)
    }

    return null
}

function DialogBodyFallback(): React.ReactElement {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-16 w-full" />
        </div>
    )
}
