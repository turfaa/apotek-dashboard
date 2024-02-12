import { buildDateRangeQueryParams } from "@/lib/api/common"
import { DrugsResponse, getDrugs } from "@/lib/api/drug"
import {
    ProcurementRecommendation,
    ProcurementRecommendationsResponse,
    getProcurementRecommendations,
} from "@/lib/api/procurement-recommendation"
import {
    SalesStatisticsResponse,
    getSalesStatistics,
} from "@/lib/api/sale-statistics"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import useSWR from "swr"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface DrugsHook {
    data?: DrugsResponse
    isLoading: boolean
    error?: Error
}

export function useDrugs(): DrugsHook {
    const { data, error, isLoading } = useSWR("/drugs", getDrugs)

    return { data, isLoading, error }
}

export interface SalesStatisticsHook {
    data?: SalesStatisticsResponse
    isLoading: boolean
    error?: Error
}

export function useSalesStatistics(): SalesStatisticsHook {
    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const from = searchParams.get("from") ?? undefined
    const until = searchParams.get("until") ?? undefined

    const { data, error, isLoading } = useSWR(
        `/sales/statistics?${buildDateRangeQueryParams(from, until)}`,
        () => getSalesStatistics(from, until),
        { refreshInterval: 10 * 1000 },
    )

    return {
        data,
        isLoading,
        error,
    }
}

export interface PurchaseOrdersHook {
    data?: Record<string, ProcurementRecommendation>
    isLoading: boolean
    error?: Error

    refresh: () => Promise<void>
    setData: (key: string, value: ProcurementRecommendation) => void
    deleteData: (key: string) => void
}

// We use Zustand to make it easier to persist the data in localStorage.
export const usePurchaseOrders = create<PurchaseOrdersHook>()(
    devtools(
        persist(
            (set): PurchaseOrdersHook => ({
                isLoading: false,
                refresh: async () => {
                    set({ isLoading: true })
                    try {
                        const data: ProcurementRecommendationsResponse =
                            await getProcurementRecommendations()
                        const keyedData: Record<
                            string,
                            ProcurementRecommendation
                        > = data.recommendations.reduce(
                            (
                                acc,
                                curr,
                            ): Record<string, ProcurementRecommendation> => ({
                                ...acc,
                                [curr.drug.vmedisCode]: curr,
                            }),
                            {},
                        )

                        set({ data: keyedData, error: undefined })
                    } catch (error) {
                        if (error instanceof Error) {
                            set({ error })
                        } else {
                            set({
                                error: new Error(
                                    "Unknown error: " + JSON.stringify(error),
                                ),
                            })
                        }
                    }

                    set({ isLoading: false })
                },
                setData: (key, value) => {
                    set((state) => ({
                        data: {
                            ...state.data,
                            [key]: value,
                        },
                    }))
                },
                deleteData: (key) => {
                    set((state) => {
                        const { [key]: _, ...rest } = state.data ?? {}
                        return { data: rest }
                    })
                },
            }),
            {
                name: "procurement-recommendations",
            },
        ),
    ),
)
