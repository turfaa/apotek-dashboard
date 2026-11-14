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
}

// "Dibuat oleh": the employee making the SP. Required and never pre-selected,
// because staff share one login and a remembered choice would mis-attribute
// SPs.
export function CreatorSelect({
    employees,
    value,
    onChange,
    error,
}: CreatorSelectProps): React.ReactElement {
    const id = useId()

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>Dibuat oleh</Label>
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
