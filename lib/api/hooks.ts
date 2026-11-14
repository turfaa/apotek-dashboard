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
    getSalary,
    getSalaryAdditionalComponents,
    getSalaryExtraInfos,
    getSalarySnapshots,
    getSalaryStaticComponents,
} from "@/lib/api/salary"
import {
    ShiftDumpStatus,
    dumpShifts,
    getShiftDumpStatus,
} from "@/lib/api/shift"
import {
    SupplierDumpStatus,
    SuppliersResponse,
    dumpSuppliers,
    getSupplierDumpStatus,
    getSuppliers,
} from "@/lib/api/supplier"
import {
    PurchaseOrderLetterDetail,
    PurchaseOrderLetterOptions,
    getPurchaseOrderLetter,
    getPurchaseOrderLetterOptions,
} from "@/lib/api/purchase-order-letter"
import {
    TokenRefreshStatus,
    getTokenRefreshStatus,
    refreshTokens,
} from "@/lib/api/token"
import {
    ReadonlyURLSearchParams,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { useEffect, useRef, useState } from "react"
import superjson from "superjson"
import useSWR from "swr"
import { Session } from "next-auth"
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

export interface SupplierDumpStatusHook {
    isDumping: boolean
    isLoading: boolean
    error?: Error
    // Whether a sync request triggered from this client is in flight.
    isStarting: boolean
    sync: () => Promise<void>
}

export interface SupplierDumpStatusOptions {
    // Called when a running sync finishes. Defaults to refreshing the
    // server-rendered page.
    onFinished?: () => void
}

export function useSupplierDumpStatus(
    options?: SupplierDumpStatusOptions,
): SupplierDumpStatusHook {
    const router = useRouter()
    const onFinished = options?.onFinished

    const { data, error, isLoading, mutate } = useSWR(
        "/v1/suppliers/dump/status",
        getSupplierDumpStatus,
        {
            // The sync usually finishes in a few seconds, so poll frequently
            // while it is running and back off when idle.
            refreshInterval: (latest) =>
                latest?.status === SupplierDumpStatus.Dumping
                    ? 2 * 1000
                    : 30 * 1000,
        },
    )

    const isDumping = data?.status === SupplierDumpStatus.Dumping

    // When a sync finishes, refresh the server-rendered list so the latest
    // suppliers are shown without a manual page reload.
    const wasDumping = useRef(false)
    useEffect(() => {
        if (wasDumping.current && !isDumping) {
            if (onFinished) {
                onFinished()
            } else {
                router.refresh()
            }
        }
        wasDumping.current = isDumping
    }, [isDumping, router, onFinished])

    const [isStarting, setIsStarting] = useState(false)

    const sync = async (): Promise<void> => {
        setIsStarting(true)
        try {
            await dumpSuppliers()
        } finally {
            // Refresh the status so the UI reflects the in-progress sync, also
            // when it failed because another sync is already running.
            await mutate()
            setIsStarting(false)
        }
    }

    return {
        isDumping,
        isLoading,
        error,
        isStarting,
        sync,
    }
}

export interface SuppliersHook {
    data?: SuppliersResponse
    isLoading: boolean
    error?: Error
    mutate: () => Promise<unknown>
}

// Suppliers synced from Vmedis. Pass enabled = false to skip fetching.
export function useSuppliers(enabled: boolean = true): SuppliersHook {
    const { data, error, isLoading, mutate } = useSWR(
        enabled ? "/v1/suppliers" : null,
        () => getSuppliers(),
        { revalidateOnFocus: false },
    )

    return { data, error, isLoading, mutate }
}

// What the create SP dialog needs: templates, signer, Vmedis supplier page.
// Pass enabled = false to skip fetching.
export function usePurchaseOrderLetterOptions(enabled: boolean = true) {
    return useSWR<PurchaseOrderLetterOptions>(
        enabled ? "/v1/procurements/purchase-orders/options" : null,
        () => getPurchaseOrderLetterOptions(),
        { revalidateOnFocus: false },
    )
}

// A stored SP with its items. Pass undefined to skip fetching.
export function usePurchaseOrderLetter(id: number | undefined) {
    return useSWR<PurchaseOrderLetterDetail>(
        id !== undefined ? `/v1/procurements/purchase-orders/${id}` : null,
        () => getPurchaseOrderLetter(id as number),
        // Stored SPs never change.
        { revalidateOnFocus: false, revalidateIfStale: false },
    )
}

export interface TokenRefreshStatusHook {
    isRefreshing: boolean
    isLoading: boolean
    error?: Error
    // Whether a refresh request triggered from this client is in flight.
    isStarting: boolean
    refresh: () => Promise<void>
}

export function useTokenRefreshStatus(): TokenRefreshStatusHook {
    const router = useRouter()

    const { data, error, isLoading, mutate } = useSWR(
        "/v2/vmedis/tokens/refresh/status",
        getTokenRefreshStatus,
        {
            // The refresh finishes fairly quickly, so poll frequently while it
            // is running and back off when idle.
            refreshInterval: (latest) =>
                latest?.status === TokenRefreshStatus.Refreshing
                    ? 2 * 1000
                    : 30 * 1000,
        },
    )

    const isRefreshing = data?.status === TokenRefreshStatus.Refreshing

    // When a refresh finishes, refresh the server-rendered table so the latest
    // token statuses are shown without a manual page reload.
    const wasRefreshing = useRef(false)
    useEffect(() => {
        if (wasRefreshing.current && !isRefreshing) {
            router.refresh()
        }
        wasRefreshing.current = isRefreshing
    }, [isRefreshing, router])

    const [isStarting, setIsStarting] = useState(false)

    const refresh = async (): Promise<void> => {
        setIsStarting(true)
        try {
            await refreshTokens()
            // Refresh the status so the UI reflects the in-progress refresh.
            await mutate()
        } finally {
            setIsStarting(false)
        }
    }

    return {
        isRefreshing,
        isLoading,
        error,
        isStarting,
        refresh,
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

// Salary hooks. Pass `undefined` for a required argument (or `enabled: false`) to skip fetching.
// Keys are shared, so e.g. the remove-components dialog and the page reading the same
// employee/month see the same cache.

const salarySWRConfig = { revalidateOnFocus: false }

export function useSalary(
    employeeID: number | undefined,
    month: string | undefined,
    session: Session | null,
) {
    return useSWR(
        employeeID !== undefined && month && session
            ? ["salary", employeeID, month]
            : null,
        ([, employeeID, month]) => getSalary(employeeID, month, session),
        {
            ...salarySWRConfig,
            onError: (error) => console.error("Failed to load salary:", error),
        },
    )
}

export function useSalaryStaticComponents(
    employeeID: number | undefined,
    session: Session | null,
) {
    return useSWR(
        employeeID !== undefined && session
            ? ["salary-static-components", employeeID]
            : null,
        ([, employeeID]) => getSalaryStaticComponents(employeeID, session),
        {
            ...salarySWRConfig,
            onError: (error) =>
                console.error("Failed to load static components:", error),
        },
    )
}

export function useSalaryAdditionalComponents(
    employeeID: number | undefined,
    month: string | undefined,
    session: Session | null,
    enabled = true,
) {
    return useSWR(
        enabled && employeeID !== undefined && month && session
            ? ["salary-additional-components", employeeID, month]
            : null,
        ([, employeeID, month]) =>
            getSalaryAdditionalComponents(employeeID, month, session),
        {
            ...salarySWRConfig,
            onError: (error) =>
                console.error("Failed to load additional components:", error),
        },
    )
}

export function useSalaryExtraInfos(
    employeeID: number | undefined,
    month: string | undefined,
    session: Session | null,
    enabled = true,
) {
    return useSWR(
        enabled && employeeID !== undefined && month && session
            ? ["salary-extra-infos", employeeID, month]
            : null,
        ([, employeeID, month]) => getSalaryExtraInfos(employeeID, month, session),
        {
            ...salarySWRConfig,
            onError: (error) => console.error("Failed to load extra infos:", error),
        },
    )
}

export function useSalarySnapshots(
    month: string | undefined,
    employeeID: number | undefined,
    session: Session | null,
) {
    return useSWR(
        month && session ? ["salary-snapshots", month, employeeID ?? null] : null,
        ([, month, employeeID]) =>
            getSalarySnapshots(
                { month, employeeID: employeeID ?? undefined },
                session,
            ),
        {
            ...salarySWRConfig,
            onError: (error) => console.error("Failed to load snapshots:", error),
        },
    )
}
