"use client"

import MetricGrid, { Datum } from "@/app/statistics/metric-grid"
import StatisticsTable from "@/app/statistics/table"
import { useSalesStatistics } from "@/lib/api/hooks"
import { SalesStatistics } from "@/lib/api/sale-statistics"
import { usePrintMode } from "@/lib/print-mode"
import { rupiah } from "@/lib/rupiah"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import {
    Callout,
    Card,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@tremor/react"

export default function ClientSide(): React.ReactElement {
    const { data, error, isLoading } = useSalesStatistics()
    const { isPrintMode } = usePrintMode()

    if (isLoading) return <p>Loading...</p>

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
                <Callout
                    className="h-12 mt-4"
                    title={error.message}
                    icon={ExclamationTriangleIcon}
                    color="rose"
                />
            )}

            <TabGroup>
                {!isPrintMode ? (
                    <TabList>
                        <Tab>Ringkasan</Tab>
                        <Tab>Statistik Harian</Tab>
                    </TabList>
                ) : (
                    <> </>
                )}

                <TabPanels>
                    <TabPanel>
                        <MetricGrid
                            title="Nominal Penjualan"
                            data={salesTotals}
                            valueFormatter={rupiah.format}
                        />
                        <MetricGrid
                            title="Banyak Penjualan"
                            data={salesNumbers}
                        />
                    </TabPanel>

                    <TabPanel>
                        <Card className="mt-6">
                            <StatisticsTable
                                statistics={data?.dailyHistory || []}
                            />
                        </Card>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </>
    )
}
