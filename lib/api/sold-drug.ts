import { fetchAPI } from "@/lib/api/base"
import { buildDateRangeQueryParams } from "@/lib/api/common"
import { Drug } from "@/lib/api/drug"

export interface SoldDrugsResponse {
    drugs: SoldDrug[]
}

export interface SoldDrug {
    drug: Drug
    occurrences: number
    totalAmount: number
}

export async function getSoldDrugs(from?: string, until?: string): Promise<SoldDrugsResponse> {
    return await fetchAPI<SoldDrugsResponse>(
        'GET',
        `/sales/drugs?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            }
        }
    )
}