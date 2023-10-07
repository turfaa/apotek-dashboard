import {fetchAPI} from "@/lib/api/base"

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
        {
            cache: 'no-cache',
        }
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