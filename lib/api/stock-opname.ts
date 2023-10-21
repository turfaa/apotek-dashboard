import { fetchAPI } from "@/lib/api/base"

export interface StockOpnamesResponse {
    stockOpnames: StockOpname[]
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