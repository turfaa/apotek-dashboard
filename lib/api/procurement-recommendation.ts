import { fetchAPI } from "@/lib/api/base"
import { Drug } from "@/lib/api/drug"

export interface ProcurementRecommendationsResponse {
    recommendations: ProcurementRecommendation[]
    computedAt: Date
}

interface UnderlyingProcurementRecommendationsResponse {
    recommendations: ProcurementRecommendation[]
    computedAt: string
}

export interface ProcurementRecommendation {
    drug: Drug
    stock: string
    fromSupplier: string
    procurement: string
    alternatives?: string[]
}

export async function getProcurementRecommendations(): Promise<ProcurementRecommendationsResponse> {
    const underlying: UnderlyingProcurementRecommendationsResponse =
        await fetchAPI<UnderlyingProcurementRecommendationsResponse>(
            "GET",
            "/procurements/recommendations",
            null,
            {
                next: {
                    revalidate: 0, // Don't cache, always revalidate.
                },
            },
        )

    return {
        ...underlying,
        computedAt: new Date(underlying.computedAt),
    }
}
