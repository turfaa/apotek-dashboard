import { fetchAPI } from "@/lib/api/base"
import { Drug } from "@/lib/api/drug"

export interface SoldDrugsResponse {
    drugs: SoldDrug[]
}

export interface SoldDrug {
    drug: Drug
    occurrences: number
    totalAmount: number
}

export async function getSoldDrugs(date?: string): Promise<SoldDrugsResponse> {
    return await fetchAPI<SoldDrugsResponse>(
        'GET',
        `/sales/drugs${date ? `?date=${date}` : ''}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            }
        }
    )
}