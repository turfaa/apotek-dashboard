import { fetchAPI } from "@/lib/api/base"
import { Drug } from "@/lib/api/drug"

export interface DrugsToStockOpnameResponse {
    drugs: Drug[]
}

export async function getDrugsToStockOpname(date?: string): Promise<DrugsToStockOpnameResponse> {
    return await fetchAPI<DrugsToStockOpnameResponse>(
        'GET',
        `/drugs/to-stock-opname/${date ? `?date=${date}` : ''}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            }
        }
    )
}