const baseUrl: string = process.env.INTERNAL_VMEDIS_PROXY_URL ?? process.env.NEXT_PUBLIC_VMEDIS_PROXY_URL ?? 'http://localhost:6969/api/v1'

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
                revalidate: 3600, // Revalidate every hour.
            }
        }
    )

    return {
        ...underlying,
        date: new Date(underlying.date),
    }
}

export interface SalesStatisticsResponse {
    history: SalesStatistics[]
}

export interface SalesStatistics {
    pulledAt: Date
    totalSales: number
    numberOfSales: number
}

interface UnderlyingSalesStatisticsResponse {
    history: UnderlyingSalesStatistics[]
}

interface UnderlyingSalesStatistics {
    pulledAt: string
    totalSales: number
    numberOfSales: number
}

export async function getDailySalesStatistics(): Promise<SalesStatisticsResponse> {
    let underlying: UnderlyingSalesStatisticsResponse = await fetchAPI<UnderlyingSalesStatisticsResponse>(
        'GET',
        '/sales/statistics/daily',
        null,
    )

    return {
        history: underlying.history.map((item: UnderlyingSalesStatistics): SalesStatistics => {
            return {
                ...item,
                pulledAt: new Date(item.pulledAt),
            }
        }),
    }
}

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

export interface Drug {
    vmedisCode: string
    name: string
    manufacturer: string
    supplier: string
    minimumStock: string
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

export async function fetchAPI<T>(method: string, url: string, body: any = null, options: object = {}): Promise<T> {
    const res: Response = await fetch(`${baseUrl}${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
        ...options,
    })

    if (!res.ok) {
        throw new Error('An error occurred while fetching the data.')
    }

    return await res.json()
}