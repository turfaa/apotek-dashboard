"use client"

import { useId, useState } from "react"
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface SupplierOption {
    vmedisId: number
    name: string
}

export interface SupplierComboboxProps {
    id?: string
    suppliers: SupplierOption[]
    value: number | null
    onChange: (vmedisId: number | null) => void
    placeholder?: string
    // When set, an extra first option with this label selects null.
    allLabel?: string
    disabled?: boolean
    className?: string
    "aria-invalid"?: boolean
}

// A searchable supplier picker (Popover + Command), shared by the create SP
// dialog and the Riwayat filter.
export function SupplierCombobox({
    id,
    suppliers,
    value,
    onChange,
    placeholder = "Pilih supplier",
    allLabel,
    disabled,
    className,
    "aria-invalid": ariaInvalid,
}: SupplierComboboxProps): React.ReactElement {
    const [open, setOpen] = useState(false)
    const listId = useId()

    const selected = suppliers.find((s) => s.vmedisId === value)
    const label = selected?.name ?? allLabel ?? placeholder

    const choose = (vmedisId: number | null) => {
        onChange(vmedisId)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={id}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={open ? listId : undefined}
                    aria-invalid={ariaInvalid}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between font-normal",
                        !selected && !allLabel && "text-muted-foreground",
                        ariaInvalid && "border-destructive",
                        className,
                    )}
                >
                    <span className="truncate">{label}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                id={listId}
                className="w-(--radix-popover-trigger-width) min-w-[240px] p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder="Cari supplier..." />
                    <CommandList>
                        <CommandEmpty>Supplier tidak ditemukan.</CommandEmpty>
                        <CommandGroup className="max-h-[240px] overflow-y-auto">
                            {allLabel && (
                                <CommandItem
                                    value={allLabel}
                                    onSelect={() => choose(null)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === null
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {allLabel}
                                </CommandItem>
                            )}
                            {suppliers.map((supplier) => (
                                <CommandItem
                                    key={supplier.vmedisId}
                                    // cmdk filters on value, and values must be
                                    // unique, so add the id to the name.
                                    value={`${supplier.name} ${supplier.vmedisId}`}
                                    onSelect={() => choose(supplier.vmedisId)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === supplier.vmedisId
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {supplier.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
