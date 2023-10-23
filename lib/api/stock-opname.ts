import { fetchAPI } from "@/lib/api/base"

export interface StockOpnamesResponse {
    stockOpnames: StockOpname[]
}

export interface StockOpnameSummariesResponse {
    summaries: StockOpnameSummary[]
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

export async function getStockOpnames(date?: string): Promise<StockOpnamesResponse> {
    return fetchAPI<StockOpnamesResponse>(
        'GET',
        `/stock-opnames/${date ? `?date=${date}` : ''}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            }
        }
    )
}

export async function getStockOpnameSummaries(date?: string): Promise<StockOpnameSummariesResponse> {
    return fetchAPI<StockOpnameSummariesResponse>(
        'GET',
        `/stock-opnames/summaries/${date ? `?date=${date}` : ''}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            }
        }
    )
}