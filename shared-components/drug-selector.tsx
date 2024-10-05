"use client"

import React, { useState, useMemo, useTransition } from "react"
import { SearchSelect, SearchSelectItem, Subtitle } from "@tremor/react"
import { Drug } from "@/lib/api/drugv2"
import { usePrintMode } from "@/lib/print-mode"
import { useDrugSelector } from "@/lib/drug-selector-hook"

const DRUG_LIST_LIMIT = 100

export function DrugSelector(): React.ReactElement {
    const [isPending] = useTransition()
    const { drugs, isLoading, error, selectedDrug, setSelectedDrug } = useDrugSelector()
    const [searchValue, setSearchValue] = useState("")
    const { isPrintMode } = usePrintMode()

    const drugsToShow = useMemo(() => {
        return drugs.filter((drug) =>
            drug.name.toLowerCase().includes(searchValue.toLowerCase()),
        )
    }, [drugs, searchValue])

    if (isPrintMode) {
        return <Subtitle>{selectedDrug?.name ?? "Pilih obat"}</Subtitle>
    }

    return (
        <SearchSelect
            disabled={isLoading || isPending || !!error}
            value={selectedDrug?.vmedisCode ?? ""}
            onValueChange={setSelectedDrug}
            onSearchValueChange={setSearchValue}
            error={!!error}
            errorMessage={error?.message ?? "Gagal memuat obat"}
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
