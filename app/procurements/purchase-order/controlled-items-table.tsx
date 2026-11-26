"use client"

import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PurchaseOrderLetterItemDetails } from "@/lib/api/purchase-order-letter"
import {
    ControlledItemErrors,
    ControlledItemValues,
    quantityWords,
} from "@/lib/purchase-order-letter-items"
import { cn } from "@/lib/utils"

export interface ControlledItemRow {
    key: string
    drugName: string
    // False for drugs added by hand, which can't go on a controlled SP.
    inVmedis: boolean
    // Undefined while loading.
    details?: PurchaseOrderLetterItemDetails
    values: ControlledItemValues
    errors: ControlledItemErrors
    golonganWarning?: string
}

export interface ControlledItemsTableProps {
    rows: ControlledItemRow[]
    isLoading: boolean
    onChange: (key: string, field: keyof ControlledItemValues, value: string) => void
}

// Rincian obat: the items of a Prekursor or OOT SP, as they print. Zat aktif
// and bentuk & kekuatan come from Vmedis and can only be changed there.
export function ControlledItemsTable({
    rows,
    isLoading,
    onChange,
}: ControlledItemsTableProps): React.ReactElement {
    return (
        <div className="flex min-w-0 flex-col gap-2 border-t pt-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm font-medium">Rincian obat ({rows.length})</span>
                <span className="text-xs text-muted-foreground">
                    Zat aktif dan bentuk &amp; kekuatan dari Data Obat Vmedis.
                    Kemasan dan jumlah bisa diubah.
                </span>
            </div>
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[800px] text-[13px]">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-8">No.</TableHead>
                            <TableHead>Nama Obat</TableHead>
                            <TableHead>Zat Aktif</TableHead>
                            <TableHead>Bentuk &amp; Kekuatan</TableHead>
                            <TableHead className="w-[150px]">Kemasan Terkecil</TableHead>
                            <TableHead className="w-[80px]">Jumlah</TableHead>
                            <TableHead>Terbilang</TableHead>
                            <TableHead className="w-[140px]">Keterangan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, index) => (
                            <ItemRow
                                key={row.key}
                                row={row}
                                number={index + 1}
                                isLoading={isLoading}
                                onChange={(field, value) => onChange(row.key, field, value)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
            <span className="text-xs text-muted-foreground">
                Jumlah ditulis dalam kemasan terkecil, angka saja. Terbilang
                dibuat otomatis. Kolom Keterangan tidak dicetak bila semua
                kosong.
            </span>
        </div>
    )
}

interface ItemRowProps {
    row: ControlledItemRow
    number: number
    isLoading: boolean
    onChange: (field: keyof ControlledItemValues, value: string) => void
}

function ItemRow({ row, number, isLoading, onChange }: ItemRowProps): React.ReactElement {
    const { details, values, errors } = row
    const words = quantityWords(values.quantity)

    return (
        <TableRow className="align-top">
            <TableCell className="text-muted-foreground">{number}</TableCell>
            <TableCell>
                <div className="font-medium">{row.drugName}</div>
                {row.golonganWarning && (
                    <div className="mt-1.5 max-w-[200px] rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs leading-snug text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50">
                        {row.golonganWarning}
                    </div>
                )}
            </TableCell>
            <VmedisCell
                value={details?.activeIngredient}
                inVmedis={row.inVmedis && details?.found !== false}
                isLoading={isLoading && !details}
            />
            <VmedisCell
                value={details?.dosageFormStrength}
                inVmedis={row.inVmedis && details?.found !== false}
                isLoading={isLoading && !details}
            />
            <TableCell>
                <FieldInput
                    label={`Kemasan terkecil obat ${number}`}
                    value={values.smallestPackage}
                    error={errors.smallestPackage}
                    onChange={(value) => onChange("smallestPackage", value)}
                />
            </TableCell>
            <TableCell>
                <FieldInput
                    label={`Jumlah obat ${number}`}
                    value={values.quantity}
                    error={errors.quantity}
                    inputMode="numeric"
                    className="text-right"
                    onChange={(value) => onChange("quantity", value)}
                />
            </TableCell>
            <TableCell className={cn(words ? "text-muted-foreground" : "text-muted-foreground/60")}>
                {words ?? "—"}
            </TableCell>
            <TableCell>
                <FieldInput
                    label={`Keterangan obat ${number}`}
                    value={values.note}
                    error={errors.note}
                    placeholder="Opsional"
                    onChange={(value) => onChange("note", value)}
                />
            </TableCell>
        </TableRow>
    )
}

interface VmedisCellProps {
    value?: string | null
    inVmedis: boolean
    isLoading: boolean
}

function VmedisCell({ value, inVmedis, isLoading }: VmedisCellProps): React.ReactElement {
    if (isLoading) {
        return <TableCell className="text-muted-foreground">Memuat…</TableCell>
    }

    if (value) {
        return <TableCell>{value}</TableCell>
    }

    return (
        <TableCell>
            <span className="inline-block rounded-md border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50">
                {inVmedis ? "Belum diisi di Vmedis" : "Tidak ada di Vmedis"}
            </span>
        </TableCell>
    )
}

interface FieldInputProps {
    label: string
    value: string
    error?: string
    placeholder?: string
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
    className?: string
    onChange: (value: string) => void
}

function FieldInput({
    label,
    value,
    error,
    placeholder,
    inputMode,
    className,
    onChange,
}: FieldInputProps): React.ReactElement {
    return (
        <div className="flex flex-col gap-1">
            <Input
                aria-label={label}
                aria-invalid={!!error}
                value={value}
                placeholder={placeholder}
                inputMode={inputMode}
                onChange={(event) => onChange(event.target.value)}
                className={cn("h-8 px-2 text-[13px]", error && "border-destructive", className)}
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
        </div>
    )
}

export interface MissingInVmedisNoticeProps {
    drugs: { key: string; name: string }[]
    vmedisDrugPageUrl?: string
    isRefreshing: boolean
    onRefresh: () => void
}

// Lists the drugs whose zat aktif or bentuk & kekuatan is empty in Vmedis,
// and how to fill them in there and load them back. Vmedis has no page per
// drug, so each name can be copied for its search box.
export function MissingInVmedisNotice({
    drugs,
    vmedisDrugPageUrl,
    isRefreshing,
    onRefresh,
}: MissingInVmedisNoticeProps): React.ReactElement {
    return (
        <div
            role="status"
            className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-50"
        >
            <p className="font-medium">Data obat belum lengkap di Vmedis</p>
            <p>
                Zat aktif atau bentuk &amp; kekuatan obat berikut belum diisi.
                Lengkapi di Data Obat Vmedis, lalu muat ulang.
            </p>
            <ul className="flex flex-col gap-1">
                {drugs.map((drug) => (
                    <li key={drug.key} className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{drug.name}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-6 bg-background px-2 text-xs"
                            aria-label={`Salin nama ${drug.name}`}
                            onClick={() => copyName(drug.name)}
                        >
                            <Copy className="mr-1 h-3 w-3" />
                            Salin nama
                        </Button>
                    </li>
                ))}
            </ul>
            <div className="flex flex-wrap gap-2 border-t border-amber-200 pt-2 dark:border-amber-800">
                {vmedisDrugPageUrl && (
                    <Button variant="outline" size="sm" className="bg-background" asChild>
                        <a href={vmedisDrugPageUrl} target="_blank" rel="noopener noreferrer">
                            Buka Data Obat di Vmedis
                            <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                    </Button>
                )}
                <Button size="sm" disabled={isRefreshing} onClick={onRefresh}>
                    <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isRefreshing && "animate-spin")} />
                    {isRefreshing ? "Memuat ulang…" : "Muat ulang dari Vmedis"}
                </Button>
            </div>
        </div>
    )
}

async function copyName(name: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(name)
        toast.success(`Nama ${name} disalin`, {
            description: "Tempel di kotak pencarian Data Obat Vmedis.",
        })
    } catch {
        toast.error("Gagal menyalin nama obat")
    }
}
