import { fetchAPI } from "@/lib/api/base"
import { buildDateRangeQueryParams } from "@/lib/api/common"

export interface StockOpnamesResponse {
    stockOpnames: StockOpname[]
}

export interface StockOpnameSummariesResponse {
    summaries: StockOpnameSummary[]
}

interface UnderlyingStockOpnameSummariesResponse {
    summaries: UnderlyingStockOpnameSummary[]
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

export interface StockOpnameSummary {
    date: Date
    drugCode: string
    drugName: string
    unit: string
    changes: StockChange[]
    quantityDifference: number
    hppDifference: number
    salePriceDifference: number
}

interface UnderlyingStockOpnameSummary {
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

export async function getStockOpnameSummaries(
    from?: string,
    until?: string,
): Promise<StockOpnameSummariesResponse> {
    const res = await fetchAPI<UnderlyingStockOpnameSummariesResponse>(
        "GET",
        `/stock-opnames/summaries?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            },
        },
    )

    return {
        summaries: res.summaries.map(
            (item: UnderlyingStockOpnameSummary): StockOpnameSummary => {
                return {
                    ...item,
                    date: new Date(item.date),
                }
            },
        ),
    }
}
