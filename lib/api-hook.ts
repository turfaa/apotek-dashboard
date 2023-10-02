import {
    getDailySalesStatistics,
    getProcurementRecommendations,
    Procurement,
    ProcurementRecommendationsResponse,
    SalesStatisticsResponse
} from "@/lib/api"
import useSWR from "swr"
import {create} from "zustand"
import {devtools, persist} from "zustand/middleware"

export interface SalesStatisticsHook {
    data?: SalesStatisticsResponse
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
        data,
        isLoading,
        error,
    }
}

export interface ProcurementRecommendationsHook {
    data?: Record<string, Procurement>
    isLoading: boolean
    error?: Error

    refresh: () => void
    setData: (key: string, value: Procurement) => void
    deleteData: (key: string) => void
}

// We use Zustand to make it easier to persist the data in localStorage.
export const useProcurementRecommendations = create<ProcurementRecommendationsHook>()(
    devtools(
        persist(
            (set): ProcurementRecommendationsHook => ({
                isLoading: false,
                refresh: async () => {
                    set({isLoading: true})
                    try {
                        const data: ProcurementRecommendationsResponse = await getProcurementRecommendations()
                        const keyedData: Record<string, Procurement> = data.recommendations.reduce((acc, curr): Record<string, Procurement> => ({
                            ...acc, [curr.drug.vmedisCode]: curr
                        }), {})

                        set({data: keyedData, error: undefined})
                    } catch (error) {
                        if (error instanceof Error) {
                            set({error})
                        } else {
                            set({error: new Error('Unknown error: ' + JSON.stringify(error))})
                        }
                    }

                    set({isLoading: false})
                },
                setData: (key, value) => {
                    set(state => ({
                        data: {
                            ...state.data,
                            [key]: value,
                        }
                    }))
                },
                deleteData: (key) => {
                    set(state => {
                        const {[key]: _, ...rest} = state.data ?? {}
                        return {data: rest}
                    })
                },
            }),
            {
                name: 'procurement-recommendations',
            }
        )
    )
)
