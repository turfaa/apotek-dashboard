import { Card } from "@tremor/react"
import { Chart, registerables } from "chart.js"
import 'chartjs-adapter-moment'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from "react-chartjs-2"

export interface MetricChartProps {
    title: string
    data: Datum[]
    valueFormatter?: (value: number) => string
}

export interface Datum {
    value: number
    timestamp: Date
}

export default function MetricChart(props: MetricChartProps): React.ReactElement {
    const formatter = props.valueFormatter ?? ((value: number) => value.toLocaleString("id-ID"))

    const data = props.data
        .map((datum, index, self) => (
            // Convert the datum to a chart.js data point.
            // The y value is the difference between the current datum and the previous datum.
            {
                x: datum.timestamp,
                y: Math.max(0, datum.value - (index == 0 ? 0 : self[index - 1].value)),
            }))
    // .filter((datum, index, self) =>
    //     // Filter out a datum if it's the same as the next datum.
    //     index == self.length - 1 || datum.y != self[index + 1].y
    // )

    return (
        <Card>
            <Line
                data={{ datasets: [{ data }] }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'hour'
                            }
                        },
                        y: { beginAtZero: true }
                    },
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            display: 'auto',
                            anchor: 'end',
                            formatter: ({ y }) => formatter(y),
                        },
                    },
                    locale: 'id-ID',
                }}
            />
        </Card>
    )
}

Chart.register(ChartDataLabels, ...registerables)