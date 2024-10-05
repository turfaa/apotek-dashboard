"use client"

import React, { useState, useMemo, useTransition } from "react"
import { SearchSelect, SearchSelectItem, Subtitle } from "@tremor/react"
import { Drug } from "@/lib/api/drugv2"
import { usePrintMode } from "@/lib/print-mode"
import { useDrugSelector } from "@/lib/drug-selector-hook"

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
        <SearchSelect
            disabled={disabled ?? isPending}
            value={selectedDrug?.vmedisCode ?? ""}
            onValueChange={setSelectedDrug}
            onSearchValueChange={setSearchValue}
            placeholder="Pilih obat..."
        >
            {drugsToShow.length === 0 && (
                <SearchSelectItem value="x">Tidak ada obat yang ditemukan</SearchSelectItem>
            )}

            {
                drugsToShow.slice(0, DRUG_LIST_LIMIT).map((drug: Drug) => (
                    <SearchSelectItem key={drug.vmedisCode} value={drug.vmedisCode}>
                        {drug.name}
                    </SearchSelectItem>
                ))
            }

            {
                drugsToShow.length > DRUG_LIST_LIMIT && (
                    <SearchSelectItem disabled className="text-gray-500" value="y">
                        {
                            `${drugsToShow.length - DRUG_LIST_LIMIT} obat tidak ditampilkan, ` +
                            "tulis nama obat lebih spesifik jika obat yang Anda cari belum muncul"
                        }
                    </SearchSelectItem>
                )
            }
        </SearchSelect>
    )
}
