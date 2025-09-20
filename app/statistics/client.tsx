"use client"

import MetricGrid, {
    MetricGridFallback,
    Datum,
} from "@/app/statistics/metric-grid"
import StatisticsTable from "@/app/statistics/table"
import { useSalesStatistics } from "@/lib/api/hooks"
import { SalesStatistics } from "@/lib/api/sale-statistics"
import { usePrintMode } from "@/lib/print-mode"
import { rupiah } from "@/lib/rupiah"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientSide(): React.ReactElement {
    const { data, error, isLoading } = useSalesStatistics()
    const { isPrintMode } = usePrintMode()

    let usedHistory = data?.history || []
    if (usedHistory.length > 24) {
        usedHistory = data?.dailyHistory || []
    }

    const salesTotals: Datum[] = usedHistory.map(
        (statistic: SalesStatistics): Datum => {
            return {
                value: statistic.totalSales,
                timestamp: statistic.pulledAt,
            }
        },
    )

    const salesNumbers: Datum[] = usedHistory.map(
        (statistic: SalesStatistics): Datum => {
            return {
                value: statistic.numberOfSales,
                timestamp: statistic.pulledAt,
            }
        },
    )

    return (
        <>
            {error && (
                <Alert variant="destructive" className="mt-4">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error.message}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="summary" className="mt-4">
                {!isPrintMode && (
                    <TabsList>
                        <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                        <TabsTrigger value="daily">Statistik Harian</TabsTrigger>
                    </TabsList>
                )}

                <TabsContent value="summary" className="mt-4">
                    {isLoading ? (
                        <div className="flex flex-col gap-6">
                            <MetricGridFallback title="Nominal Penjualan" />
                            <MetricGridFallback title="Banyak Penjualan" />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <MetricGrid
                                title="Nominal Penjualan"
                                data={salesTotals}
                                valueFormatter={rupiah.format}
                            />
                            <MetricGrid
                                title="Banyak Penjualan"
                                data={salesNumbers}
                            />
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="daily" className="mt-4">
                    <div className="rounded-md border">
                        <StatisticsTable
                            statistics={data?.dailyHistory || []}
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}
