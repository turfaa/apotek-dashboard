"use client"

import React, { useState, useMemo, useTransition } from "react"
import { Subtitle } from "@/components/typography"
import { Drug } from "@/lib/api/drugv2"
import { usePrintMode } from "@/lib/print-mode"
import { useDrugSelector } from "@/lib/drug-selector-hook"
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
import { Button } from "@/components/ui/button"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

const DRUG_LIST_LIMIT = 100

export interface DrugSelectorClientProps {
    drugs: Drug[]
    disabled?: boolean
}

export default function DrugSelectorClient({
    drugs,
    disabled,
}: DrugSelectorClientProps): React.ReactElement {
    const [isPending] = useTransition()
    const { selectedDrug, setSelectedDrug } = useDrugSelector(drugs)
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const { isPrintMode } = usePrintMode()

    const drugsToShow = useMemo(() => {
        let filtered = drugs.filter((drug) =>
            drug.name.toLowerCase().includes(searchValue.toLowerCase()),
        )

        if (!!selectedDrug) {
            const foundIndex = filtered.findIndex((drug) => drug.vmedisCode === selectedDrug.vmedisCode)
            if (foundIndex !== -1) {
                filtered = [filtered[foundIndex], ...filtered.slice(0, foundIndex), ...filtered.slice(foundIndex + 1)]
            }
        }

        return filtered
    }, [drugs, searchValue, selectedDrug])

    if (isPrintMode) {
        return <Subtitle>{selectedDrug?.name ?? "Pilih obat"}</Subtitle>
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled ?? isPending}
                >
                    {selectedDrug ? selectedDrug.name : "Pilih obat..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command className="w-full">
                    <CommandInput
                        placeholder="Cari obat..."
                        value={searchValue}
                        onValueChange={setSearchValue}
                    />
                    <CommandList>
                        <CommandEmpty>Tidak ada obat yang ditemukan</CommandEmpty>
                        <CommandGroup className="max-h-[300px] overflow-auto">
                            {drugsToShow.slice(0, DRUG_LIST_LIMIT).map((drug) => (
                                <CommandItem
                                    key={drug.vmedisCode}
                                    value={drug.name}
                                    onSelect={() => {
                                        setSelectedDrug(drug.vmedisCode)
                                        setOpen(false)
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedDrug?.vmedisCode === drug.vmedisCode
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {drug.name}
                                </CommandItem>
                            ))}
                            {drugsToShow.length > DRUG_LIST_LIMIT && (
                                <CommandItem disabled className="text-gray-500" value="zzzzzzzz" forceMount>
                                    {`${drugsToShow.length - DRUG_LIST_LIMIT} obat tidak ditampilkan, ` +
                                        "tulis nama obat lebih spesifik jika obat yang Anda cari belum muncul"}
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
