import { buildDateRangeQueryParams } from "@/lib/api/common"
import { DrugsResponse, getDrugs } from "@/lib/api/drug"
import {
    DrugsResponse as DrugsResponseV2,
    getDrugs as getDrugsV2,
} from "./drugv2"
import {
    ProcurementRecommendation,
    ProcurementRecommendationStatus,
    ProcurementRecommendationsResponse,
    dumpProcurementRecommendations,
    getProcurementRecommendationStatus,
    getProcurementRecommendations,
} from "@/lib/api/procurement-recommendation"
import {
    SalesStatisticsResponse,
    getSalesStatistics,
} from "@/lib/api/sale-statistics"
import {
    ShiftDumpStatus,
    dumpShifts,
    getShiftDumpStatus,
} from "@/lib/api/shift"
import {
    ReadonlyURLSearchParams,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useEffect, useRef, useState } from "react"
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

export interface ProcurementRecommendationStatusHook {
    isGenerating: boolean
    isLoading: boolean
    error?: Error
    // Whether a generation request triggered from this client is in flight.
    isStarting: boolean
    generate: () => Promise<void>
}

export function useProcurementRecommendationStatus(): ProcurementRecommendationStatusHook {
    const { data, error, isLoading, mutate } = useSWR(
        "/v1/procurements/recommendations/status",
        getProcurementRecommendationStatus,
        {
            // Generation takes at most 10 minutes. Poll frequently while it is
            // running so the warning clears soon after the backend finishes,
            // and back off when idle.
            refreshInterval: (latest) =>
                latest?.status === ProcurementRecommendationStatus.Generating
                    ? 10 * 1000
                    : 60 * 1000,
        },
    )

    const [isStarting, setIsStarting] = useState(false)

    const generate = async (): Promise<void> => {
        setIsStarting(true)
        try {
            await dumpProcurementRecommendations()
            // Refresh the status so the UI reflects the in-progress generation.
            await mutate()
        } finally {
            setIsStarting(false)
        }
    }

    return {
        isGenerating:
            data?.status === ProcurementRecommendationStatus.Generating,
        isLoading,
        error,
        isStarting,
        generate,
    }
}

export interface ShiftDumpStatusHook {
    isDumping: boolean
    isLoading: boolean
    error?: Error
    // Whether a dump request triggered from this client is in flight.
    isStarting: boolean
    fetchLatest: () => Promise<void>
}

export function useShiftDumpStatus(): ShiftDumpStatusHook {
    const router = useRouter()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const from = searchParams.get("from") ?? undefined
    const until = searchParams.get("until") ?? undefined

    const { data, error, isLoading, mutate } = useSWR(
        "/v2/shifts/dump/status",
        getShiftDumpStatus,
        {
            // The dump usually finishes in a few seconds, so poll frequently
            // while it is running and back off when idle.
            refreshInterval: (latest) =>
                latest?.status === ShiftDumpStatus.Dumping
                    ? 2 * 1000
                    : 30 * 1000,
        },
    )

    const isDumping = data?.status === ShiftDumpStatus.Dumping

    // When a dump finishes, refresh the server-rendered table so the latest
    // shifts are shown without a manual page reload.
    const wasDumping = useRef(false)
    useEffect(() => {
        if (wasDumping.current && !isDumping) {
            router.refresh()
        }
        wasDumping.current = isDumping
    }, [isDumping, router])

    const [isStarting, setIsStarting] = useState(false)

    const fetchLatest = async (): Promise<void> => {
        setIsStarting(true)
        try {
            await dumpShifts(from, until)
            // Refresh the status so the UI reflects the in-progress dump.
            await mutate()
        } finally {
            setIsStarting(false)
        }
    }

    return {
        isDumping,
        isLoading,
        error,
        isStarting,
        fetchLatest,
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
                        const newData = { ...state.data }
                        delete newData[key]
                        return { data: newData }
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
