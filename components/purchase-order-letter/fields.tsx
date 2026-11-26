"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterItem,
    PurchaseOrderLetterSigner,
} from "@/lib/api/purchase-order-letter"
import { cn } from "@/lib/utils"
import { useId } from "react"

export interface CreatorSelectProps {
    employees: PurchaseOrderLetterEmployee[]
    value: number | null
    onChange: (id: number) => void
    // Shown under the field, e.g. when submitting without a choice.
    error?: string
    // Defaults to "Dibuat oleh".
    label?: string
}

// "Dibuat oleh": the employee making the SP. Required and never pre-selected,
// because staff share one login and a remembered choice would mis-attribute
// SPs.
export function CreatorSelect({
    employees,
    value,
    onChange,
    error,
    label = "Dibuat oleh",
}: CreatorSelectProps): React.ReactElement {
    const id = useId()

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={value === null ? "" : String(value)}
                onValueChange={(v) => onChange(Number(v))}
            >
                <SelectTrigger
                    id={id}
                    aria-invalid={!!error}
                    className={cn(error && "border-destructive")}
                >
                    <SelectValue placeholder="Pilih karyawan" />
                </SelectTrigger>
                <SelectContent>
                    {employees.map((employee) => (
                        <SelectItem key={employee.id} value={String(employee.id)}>
                            {employee.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

export interface SignatureCheckboxProps {
    checked: boolean
    onChange: (checked: boolean) => void
    signer?: PurchaseOrderLetterSigner
}

export function SignatureCheckbox({
    checked,
    onChange,
    signer,
}: SignatureCheckboxProps): React.ReactElement {
    const id = useId()

    return (
        <div className="flex items-start gap-3 rounded-md border p-3">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(value) => onChange(value === true)}
                className="mt-0.5"
            />
            <div className="flex flex-col gap-1">
                <Label htmlFor={id} className="leading-snug">
                    Tambahkan tanda tangan Apoteker Penanggung Jawab
                </Label>
                {signer && (
                    <span className="text-xs text-muted-foreground">
                        apt. {signer.name} · SIPA {signer.licenseNumber}
                    </span>
                )}
            </div>
        </div>
    )
}

export interface LetterItem {
    drugName: string
    quantity: string
}

// The items as they print: No., Nama Obat, Jumlah.
export function LetterItemsTable({
    items,
}: {
    items: LetterItem[]
}): React.ReactElement {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="text-muted-foreground">
                            {index + 1}
                        </TableCell>
                        <TableCell>{item.drugName}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                            {item.quantity}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

// The items of a stored Prekursor or OOT SP, as they print.
export function ControlledLetterItemsTable({
    items,
}: {
    items: PurchaseOrderLetterItem[]
}): React.ReactElement {
    const hasNote = items.some((item) => item.note?.trim())

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-[640px] text-[13px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-8">No.</TableHead>
                        <TableHead>Nama Obat</TableHead>
                        <TableHead>Zat Aktif</TableHead>
                        <TableHead>Bentuk &amp; Kekuatan</TableHead>
                        <TableHead>Kemasan Terkecil</TableHead>
                        <TableHead className="text-right">Jumlah</TableHead>
                        <TableHead>Terbilang</TableHead>
                        {hasNote && <TableHead>Ket.</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index} className="align-top">
                            <TableCell className="text-muted-foreground">
                                {index + 1}
                            </TableCell>
                            <TableCell>{item.drugName}</TableCell>
                            <TableCell>{item.activeIngredient}</TableCell>
                            <TableCell>{item.dosageFormStrength}</TableCell>
                            <TableCell>{item.smallestPackage}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {item.quantityWords}
                            </TableCell>
                            {hasNote && <TableCell>{item.note}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

// The items of a stored SP, in the columns of its template.
export function StoredLetterItemsTable({
    items,
    controlled,
}: {
    items: PurchaseOrderLetterItem[]
    controlled: boolean
}): React.ReactElement {
    return controlled ? (
        <ControlledLetterItemsTable items={items} />
    ) : (
        <LetterItemsTable items={items} />
    )
}
