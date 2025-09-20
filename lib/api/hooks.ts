import { buildDateRangeQueryParams } from "@/lib/api/common"
import { DrugsResponse, getDrugs } from "@/lib/api/drug"
import {
    DrugsResponse as DrugsResponseV2,
    getDrugs as getDrugsV2,
} from "./drugv2"
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
import superjson from "superjson"
import useSWR from "swr"
import { create } from "zustand"
import { StorageValue, devtools, persist } from "zustand/middleware"

export interface DrugsHook {
    data?: DrugsResponse
    isLoading: boolean
    error?: Error
}

export function useDrugs(): DrugsHook {
    const { data, error, isLoading } = useSWR("/v1/drugs", getDrugs)

    return { data, isLoading, error }
}

export interface DrugsV2Hook {
    data?: DrugsResponseV2
    isLoading: boolean
    error?: Error
}

export function useDrugsV2(): DrugsV2Hook {
    const { data, error, isLoading } = useSWR("/v2/drugs", () => getDrugsV2())

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
    computedAt?: Date
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

                        set({
                            data: keyedData,
                            computedAt: data.computedAt,
                            error: undefined,
                        })
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
                storage: {
                    getItem: (key) => {
                        const item = localStorage.getItem(key)
                        if (item === null) return null

                        return superjson.parse<
                            StorageValue<PurchaseOrdersHook>
                        >(item)
                    },
                    setItem: (key, value) => {
                        localStorage.setItem(key, superjson.stringify(value))
                    },
                    removeItem: (key) => localStorage.removeItem(key),
                },
            },
        ),
    ),
)
