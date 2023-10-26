import { fetchAPI } from "@/lib/api/base"
import { buildDateRangeQueryParams } from "@/lib/api/common"

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

export async function getSalesStatistics(from?: string, until?: string): Promise<SalesStatisticsResponse> {
    const underlying = await fetchAPI<UnderlyingSalesStatisticsResponse>(
        'GET',
        `/sales/statistics?${buildDateRangeQueryParams(from, until)}`,
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
        })
    }
}

export async function getDailySalesStatistics(): Promise<SalesStatisticsResponse> {
    const underlying: UnderlyingSalesStatisticsResponse = await fetchAPI<UnderlyingSalesStatisticsResponse>(
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