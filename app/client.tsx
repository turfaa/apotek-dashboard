'use client'

import MetricGrid, {Datum} from "@/app/metric-grid"
import {SalesStatistics} from "@/lib/api"
import {useDailySalesStatistics} from "@/lib/api-hook"

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
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error.message}</span>
                </div>
            )}

            <MetricGrid title="Nominal Penjualan" data={salesTotals} valueFormatter={rupiah.format}/>
            <MetricGrid title="Banyak Penjualan" data={salesNumbers}/>
        </>
    )
}