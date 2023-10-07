import {fetchAPI} from "@/lib/api/base"
import {Drug} from "@/lib/api/drug"

export interface DrugsToStockOpnameResponse {
    drugs: Drug[]
    date: Date
}

export interface UnderlyingDrugsToStockOpnameResponse {
    drugs: Drug[]
    date: string
}

export async function getDrugsToStockOpname(date?: string): Promise<DrugsToStockOpnameResponse> {
    const underlying = await fetchAPI<UnderlyingDrugsToStockOpnameResponse>(
        'GET',
        `/drugs/to-stock-opname/${date ? `?date=${date}` : ''}`,
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