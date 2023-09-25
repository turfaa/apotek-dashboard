'use client'

import MetricGrid, {Datum} from "@/app/statistics/metric-grid"
import {SalesStatistics} from "@/lib/api"
import {useDailySalesStatistics} from "@/lib/api-hook"
import {Callout} from "@tremor/react"
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid"

const rupiah = new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR"})

export default function ClientSide(): React.ReactElement {
    const {data, error, isLoading} = useDailySalesStatistics()

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

            <MetricGrid title="Nominal Penjualan" data={salesTotals} valueFormatter={rupiah.format}/>
            <MetricGrid title="Banyak Penjualan" data={salesNumbers}/>
        </>
    )
}