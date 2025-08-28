import { fetchAPI } from "@/lib/api/base"
import { buildDateRangeQueryParams } from "@/lib/api/common"

export interface SalesStatisticsResponse {
    history: SalesStatistics[]
    dailyHistory: SalesStatistics[]
}

export interface SalesStatistics {
    pulledAt: Date
    totalSales: number
    numberOfSales: number
}

interface UnderlyingSalesStatisticsResponse {
    history: UnderlyingSalesStatistics[]
    dailyHistory: UnderlyingSalesStatistics[]
}

interface UnderlyingSalesStatistics {
    pulledAt: string
    totalSales: number
    numberOfSales: number
}

export async function getSalesStatistics(
    from?: string,
    until?: string,
): Promise<SalesStatisticsResponse> {
    const underlying = await fetchAPI<UnderlyingSalesStatisticsResponse>(
        "GET",
        `/sales/statistics?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
    )

    return {
        history: underlying.history.map(
            (item: UnderlyingSalesStatistics): SalesStatistics => {
                return {
                    ...item,
                    pulledAt: new Date(item.pulledAt),
                }
            },
        ),
        dailyHistory: underlying.dailyHistory.map(
            (item: UnderlyingSalesStatistics): SalesStatistics => {
                return {
                    ...item,
                    pulledAt: new Date(item.pulledAt),
                }
            },
        ),
    }
}
