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
        "/procurement/invoice-calculators",
        null,
        {
            cache: "no-cache",
        },
    )
}
