import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Chart } from "chart.js/auto"
import "chartjs-adapter-moment"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Line } from "react-chartjs-2"

export interface MetricChartProps {
    data: Datum[]
    valueFormatter?: (value: number) => string
}

export interface Datum {
    value: number
    timestamp: Date
}

export default function MetricChart(
    props: MetricChartProps,
): React.ReactElement {
    const formatter =
        props.valueFormatter ??
        ((value: number) => value.toLocaleString("id-ID"))

    const data = props.data
        .map((datum, index, self) => (
            // Convert the datum to a chart.js data point.
            // The y value is the difference between the current datum and the previous datum if they're in the same date.
            {
                x: datum.timestamp,
                y: Math.max(
                    0,
                    index == 0 ||
                        datum.timestamp.toDateString() !=
                        self[index - 1].timestamp.toDateString()
                        ? datum.value
                        : datum.value - self[index - 1].value,
                ),
            }
        ))
        .filter(
            (datum, index, self) =>
                // Filter out a datum if it's the same as the next datum.
                index == self.length - 1 || datum.y != self[index + 1].y,
        )

    const timeUnit =
        data.length < 2
            ? "hour"
            : data[1].x.toDateString() === data[0].x.toDateString()
                ? "hour"
                : "day"

    return (
        <Card className="p-6">
            <Line
                data={{ datasets: [{ data }] }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: "time",
                            time: {
                                unit: timeUnit,
                            },
                        },
                        y: { beginAtZero: true },
                    },
                    plugins: {
                        legend: { display: false },
                        datalabels: {
                            display: "auto",
                            anchor: "end",
                            formatter: ({ y }) => formatter(y),
                        },
                    },
                    locale: "id-ID",
                }}
            />
        </Card>
    )
}

Chart.register(ChartDataLabels)

export function MetricChartFallback(): React.ReactElement {
    return (
        <Card className="p-6">
            <Skeleton className="h-[150px] w-full" />
        </Card>
    )
}
