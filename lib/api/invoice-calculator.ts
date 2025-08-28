import { fetchAPI } from "@/lib/api/base"

export interface InvoiceCalculatorsResponse {
    calculators: InvoiceCalculator[]
}

export interface InvoiceCalculator {
    supplier: string
    shouldRound: boolean
    components: InvoiceComponent[]
}

export interface InvoiceComponent {
    name: string
    multiplier: number
}

export async function GetInvoiceCalculators(): Promise<InvoiceCalculatorsResponse> {
    return await fetchAPI<InvoiceCalculatorsResponse>(
        "GET",
        "/procurements/invoice-calculators",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
    )
}
