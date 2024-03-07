import { fetchAPI } from "@/lib/api/base"
import { buildDateRangeQueryParams } from "@/lib/api/common"

export interface StockOpnamesResponse {
    stockOpnames: StockOpname[]
}

export interface CompactedStockOpnamesResponse {
    stockOpnames: CompactedStockOpname[]
}

interface UnderlyingCompactedStockOpnamesResponse {
    stockOpnames: UnderlyingCompactedStockOpnames[]
}

export interface StockOpname {
    vmedisId: string
    drugCode: string
    drugName: string
    batchCode: string
    unit: string
    initialQuantity: number
    realQuantity: number
    quantityDifference: number
    hppDifference: number
    salePriceDifference: number
    notes: string
}

export interface CompactedStockOpname {
    date: Date
    drugCode: string
    drugName: string
    unit: string
    changes: StockChange[]
    quantityDifference: number
    hppDifference: number
    salePriceDifference: number
}

interface UnderlyingCompactedStockOpnames {
    date: string
    drugCode: string
    drugName: string
    unit: string
    changes: StockChange[]
    quantityDifference: number
    hppDifference: number
    salePriceDifference: number
}

export interface StockChange {
    batchCode: string
    initialQuantity: number
    realQuantity: number
}

export async function getStockOpnames(
    from?: string,
    until?: string,
): Promise<StockOpnamesResponse> {
    return fetchAPI<StockOpnamesResponse>(
        "GET",
        `/stock-opnames?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            },
        },
    )
}

export async function getCompactedStockOpnames(
    from?: string,
    until?: string,
): Promise<CompactedStockOpnamesResponse> {
    const res = await fetchAPI<UnderlyingCompactedStockOpnamesResponse>(
        "GET",
        `/stock-opnames/compacted?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            },
        },
    )

    return {
        stockOpnames: res.stockOpnames.map(
            (item: UnderlyingCompactedStockOpnames): CompactedStockOpname => {
                return {
                    ...item,
                    date: new Date(item.date),
                }
            },
        ),
    }
}
