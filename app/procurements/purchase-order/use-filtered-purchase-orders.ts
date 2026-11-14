"use client"

import { usePurchaseOrders } from "@/lib/api/hooks"
import { ProcurementRecommendation } from "@/lib/api/procurement-recommendation"
import useSearch from "@/lib/search-hook"

export interface Row {
    vmedisCode: string
    name: string
    manufacturer: string
    minimumStock: string
    stock: string
    alternatives?: string[]
    procurement: string
    supplier: string

    raw: ProcurementRecommendation
}

export interface FilteredPurchaseOrders {
    // The rows the Buat Pesanan table shows: filtered by the search query and
    // sorted by name, with the current edits.
    rows: Row[]
    query: string
    isLoading: boolean
    error?: Error
}

// The table and the Buat Surat Pesanan dialog both read their rows from here,
// so the letter always has exactly the rows on screen.
export function useFilteredPurchaseOrders(): FilteredPurchaseOrders {
    const { data, isLoading, error } = usePurchaseOrders()
    const { query } = useSearch()

    const lowerQuery = query.toLowerCase()
    const rows: Row[] = Object.values(data || {})
        .map((procurement: ProcurementRecommendation) => ({
            vmedisCode: procurement.drug.vmedisCode,
            name: procurement.drug.name,
            manufacturer: procurement.drug.manufacturer,
            minimumStock: procurement.drug.minimumStock,
            stock: procurement.stock,
            alternatives: procurement.alternatives,
            procurement: procurement.procurement,
            supplier: procurement.fromSupplier ?? "",
            raw: procurement,
        }))
        .filter((row: Row) =>
            (row.vmedisCode + row.name + row.manufacturer + row.supplier)
                .toLowerCase()
                .includes(lowerQuery),
        )
        .sort((a, b) => a.name.localeCompare(b.name))

    return { rows, query, isLoading, error }
}

// Rows added with Tambah Obat get a random code, so their code is not a
// Vmedis code. They are marked isManual; rows added before that mark existed
// are recognised by having no units, no manufacturer and no stock, which a
// Vmedis drug in the recommendations always has.
export function isVmedisDrug(row: Row): boolean {
    const { isManual, drug, stock } = row.raw
    if (isManual) return false

    const looksManual =
        drug.units.length === 0 && !drug.manufacturer && !stock.trim()
    return !looksManual
}
