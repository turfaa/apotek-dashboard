import {fetchAPI} from "@/lib/api/base"
import {Drug} from "@/lib/api/drug"

export interface SoldDrugsResponse {
    date: Date
    drugs: SoldDrug[]
}

export interface SoldDrug {
    drug: Drug
    occurrences: number
    totalAmount: number
}

interface UnderlyingSoldDrugsResponse {
    date: string
    drugs: UnderlyingSoldDrug[]
}

interface UnderlyingSoldDrug {
    drug: Drug
    occurrences: number
    totalAmount: number
}

export async function getSoldDrugs(date?: string): Promise<SoldDrugsResponse> {
    const underlying: UnderlyingSoldDrugsResponse = await fetchAPI<UnderlyingSoldDrugsResponse>(
        'GET',
        `/sales/drugs${date ? `?date=${date}` : ''}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            }
        }
    )

    return {
        ...underlying,
        date: new Date(underlying.date),
    }
}