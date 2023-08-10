'use client'

import MetricGrid, {Datum} from "@/app/metric-grid"
import {SalesStatistics} from "@/lib/api"
import {useDailySalesStatistics} from "@/lib/api-hook"
import {Callout} from "@tremor/react";
import {ExclamationTriangleIcon} from "@heroicons/react/24/solid";

const rupiah = new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR"})

export default function ClientSide(): React.ReactElement {
    const {history, error, isLoading} = useDailySalesStatistics()

    if (isLoading) return <p>Loading...</p>

    const salesTotals: Datum[] = history.map((statistic: SalesStatistics): Datum => {
        return {
            value: statistic.totalSales,
            timestamp: statistic.pulledAt,
        }
    })

    const salesNumbers: Datum[] = history.map((statistic: SalesStatistics): Datum => {
        return {
            value: statistic.numberOfSales,
            timestamp: statistic.pulledAt,
        }
    })

    return (
        <>
            {error && (
                <Callout
                    className="h-12 mt-4"
                    title="Critical speed limit reached"
                    icon={ExclamationTriangleIcon}
                    color="rose"
                >
                    {error.message}
                </Callout>
            )}

            <MetricGrid title="Nominal Penjualan" data={salesTotals} valueFormatter={rupiah.format}/>
            <MetricGrid title="Banyak Penjualan" data={salesNumbers}/>
        </>
    )
}