'use client'

import MetricGrid, { Datum } from "@/app/statistics/metric-grid"
import { useSalesStatistics } from "@/lib/api/hooks"
import { SalesStatistics } from "@/lib/api/sale-statistics"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { Callout } from "@tremor/react"
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { useEffect } from "react"

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })

export default function ClientSide(): React.ReactElement {
    const { setDateRange, data, error, isLoading } = useSalesStatistics()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const from = searchParams.get("from") ?? undefined
    const until = searchParams.get("until") ?? undefined

    useEffect(() => {
        setDateRange(from, until)
    }, [from, until])

    if (isLoading) return <p>Loading...</p>

    const salesTotals: Datum[] = data?.history.map((statistic: SalesStatistics): Datum => {
        return {
            value: statistic.totalSales,
            timestamp: statistic.pulledAt,
        }
    }) || []

    const salesNumbers: Datum[] = data?.history.map((statistic: SalesStatistics): Datum => {
        return {
            value: statistic.numberOfSales,
            timestamp: statistic.pulledAt,
        }
    }) || []

    return (
        <>
            {error && (
                <Callout
                    className="h-12 mt-4"
                    title={error.message}
                    icon={ExclamationTriangleIcon}
                    color="rose"
                />
            )}

            <MetricGrid title="Nominal Penjualan" data={salesTotals} valueFormatter={rupiah.format} />
            <MetricGrid title="Banyak Penjualan" data={salesNumbers} />
        </>
    )
}