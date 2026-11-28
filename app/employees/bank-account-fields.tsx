"use client"

import { useId, useState } from "react"
import { useFormContext } from "react-hook-form"
import * as z from "zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useBIFASTParticipants } from "@/lib/api/hooks"
import { BankAccount, BIFASTParticipant, deleteBankAccount, putBankAccount } from "@/lib/api/salary"
import { cn } from "@/lib/utils"

// "Rekening Bank (untuk transfer gaji)" on the employee forms: the account
// the OCBC BI-FAST transfer file pays. It is all or nothing, and saved with
// its own call after the employee (it lives under /api/salary, ADMIN only).

export const bankAccountFields = {
    bankBIC: z.string(),
    accountNumber: z.string(),
    accountName: z.string(),
}

export interface BankAccountFormValues {
    bankBIC: string
    accountNumber: string
    accountName: string
}

export function bankAccountDefaults(account: BankAccount | null): BankAccountFormValues {
    return {
        bankBIC: account?.bankBIC ?? "",
        accountNumber: account?.accountNumber ?? "",
        accountName: account?.accountName ?? "",
    }
}

// Checks the bank account fields: empty, or all filled in and valid. Use with
// a zod object's superRefine.
export function refineBankAccount(values: BankAccountFormValues, ctx: z.RefinementCtx): void {
    const accountNumber = values.accountNumber.trim()
    const accountName = values.accountName.trim()
    if (!values.bankBIC && !accountNumber && !accountName) return

    if (!values.bankBIC) {
        ctx.addIssue({ code: "custom", path: ["bankBIC"], message: "Pilih bank, atau kosongkan semua data rekening." })
    }
    if (!/^[0-9]{1,19}$/.test(accountNumber)) {
        ctx.addIssue({ code: "custom", path: ["accountNumber"], message: "No. rekening harus 1 sampai 19 angka." })
    }
    if (!accountName) {
        ctx.addIssue({ code: "custom", path: ["accountName"], message: "Isi nama pemilik rekening." })
    } else if (accountName.length > 100 || !/^[A-Za-z0-9 .,/'-]+$/.test(accountName)) {
        ctx.addIssue({
            code: "custom",
            path: ["accountName"],
            message: "Maksimal 100 karakter: huruf, angka, spasi dan . , / - '",
        })
    }
}

// Saves the bank account fields: sets them when filled in, removes the stored
// account when they were emptied. Throws SalaryApiError.
export async function saveBankAccount(
    employeeID: number,
    values: BankAccountFormValues,
    hadAccount: boolean,
): Promise<void> {
    const account = {
        bankBIC: values.bankBIC,
        accountNumber: values.accountNumber.trim(),
        accountName: values.accountName.trim(),
    }

    if (account.bankBIC) {
        await putBankAccount(employeeID, account)
    } else if (hadAccount) {
        await deleteBankAccount(employeeID)
    }
}

export function BankAccountFields(): React.ReactElement {
    const form = useFormContext<BankAccountFormValues>()

    return (
        <fieldset className="rounded-lg border p-4 space-y-4">
            <legend className="px-1 text-base font-medium">Rekening Bank (untuk transfer gaji)</legend>
            <p className="text-sm text-muted-foreground">
                Dipakai untuk file transfer OCBC (BI-FAST) di Snapshot Gaji. Kosongkan semua jika belum ada.
            </p>
            <FormField
                control={form.control}
                name="bankBIC"
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormLabel>Bank</FormLabel>
                        <FormControl>
                            <BankCombobox
                                value={field.value}
                                onChange={field.onChange}
                                aria-invalid={fieldState.invalid}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>No. Rekening</FormLabel>
                        <FormControl>
                            <Input inputMode="numeric" autoComplete="off" placeholder="Hanya angka" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nama Pemilik Rekening</FormLabel>
                        <FormControl>
                            <Input autoComplete="off" placeholder="Sesuai buku tabungan" {...field} />
                        </FormControl>
                        <FormDescription>Harus sama dengan nama di rekening bank.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {(form.watch("bankBIC") || form.watch("accountNumber") || form.watch("accountName")) && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        form.setValue("bankBIC", "", { shouldDirty: true })
                        form.setValue("accountNumber", "", { shouldDirty: true })
                        form.setValue("accountName", "", { shouldDirty: true })
                        form.clearErrors(["bankBIC", "accountNumber", "accountName"])
                    }}
                >
                    Kosongkan data rekening
                </Button>
            )}
        </fieldset>
    )
}

interface BankComboboxProps {
    value: string
    onChange: (bic: string) => void
    "aria-invalid"?: boolean
}

// A searchable picker over OCBC's BI-FAST participant list, by name or BIC.
function BankCombobox({ value, onChange, "aria-invalid": ariaInvalid }: BankComboboxProps): React.ReactElement {
    const [open, setOpen] = useState(false)
    const listId = useId()
    const { data: participants, error, isLoading } = useBIFASTParticipants()

    const selected: BIFASTParticipant | undefined = participants?.find((p) => p.bic === value)
    let label = "Pilih bank"
    if (selected) label = `${selected.name} (${selected.bic})`
    else if (value) label = `${value} (tidak ada di daftar BI-FAST OCBC)`
    else if (isLoading) label = "Memuat daftar bank..."

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={open ? listId : undefined}
                    aria-invalid={ariaInvalid}
                    disabled={!participants}
                    className={cn(
                        "w-full justify-between font-normal",
                        !value && "text-muted-foreground",
                        ariaInvalid && "border-destructive",
                    )}
                >
                    <span className="truncate">{error ? "Gagal memuat daftar bank" : label}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent id={listId} className="w-(--radix-popover-trigger-width) min-w-[280px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Cari nama bank atau BIC..." />
                    <CommandList>
                        <CommandEmpty>Bank tidak ditemukan.</CommandEmpty>
                        <CommandGroup className="max-h-[260px] overflow-y-auto">
                            {participants?.map((p) => (
                                <CommandItem
                                    key={p.bic}
                                    value={`${p.name} ${p.bic}`}
                                    onSelect={() => {
                                        onChange(p.bic)
                                        setOpen(false)
                                    }}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === p.bic ? "opacity-100" : "opacity-0")} />
                                    <span className="flex-1">{p.name}</span>
                                    <span className="text-xs text-muted-foreground">{p.bic}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
