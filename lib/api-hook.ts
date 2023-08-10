import {getDailySalesStatistics, SalesStatistics} from "@/lib/api"
import useSWR from "swr"

export interface SalesStatisticsHook {
    history: SalesStatistics[]
    isLoading: boolean
    error?: Error
}

export function useDailySalesStatistics(): SalesStatisticsHook {
    const {data, error, isLoading} = useSWR(
        '/sales/statistics/daily',
        getDailySalesStatistics,
        {refreshInterval: 10 * 1000},
    )

    return {
        history: data?.history || [],
        isLoading,
        error,
    }
}