import {fetchAPI} from "@/lib/api/base"
import {Drug} from "@/lib/api/drug"

export interface ProcurementRecommendationsResponse {
    recommendations: Procurement[]
    computedAt: Date
}

interface UnderlyingProcurementRecommendationsResponse {
    recommendations: Procurement[]
    computedAt: string
}

export interface Procurement {
    drug: Drug
    stock: string
    fromSupplier: string
    procurement: string
    alternatives?: string[]
}

export async function getProcurementRecommendations(): Promise<ProcurementRecommendationsResponse> {
    const underlying: UnderlyingProcurementRecommendationsResponse = await fetchAPI<UnderlyingProcurementRecommendationsResponse>(
        'GET',
        '/procurement/recommendations',
        null,
    )

    return {
        ...underlying,
        computedAt: new Date(underlying.computedAt),
    }
}

