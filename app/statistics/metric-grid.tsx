import MetricCard, { MetricCardFallback } from "@/app/statistics/metric-card"
import MetricChart, { MetricChartFallback } from "@/app/statistics/metric-chart"

export interface MetricGridProps {
    title: string
    data: Datum[]
    valueFormatter?: (value: number) => string
}

export interface Datum {
    value: number
    timestamp: Date
}

export default function MetricGrid(props: MetricGridProps): React.ReactElement {
    const latest: Datum = props.data[props.data.length - 1] ?? {
        value: 0,
        timestamp: new Date(),
    }

    let sum = 0
    for (let i = 0; i < props.data.length; i++) {
        if (
            i == props.data.length - 1 ||
            props.data[i].timestamp.getDate() !=
                props.data[i + 1].timestamp.getDate()
        ) {
            sum += props.data[i].value
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricCard
                title={props.title}
                value={sum}
                lastUpdated={latest.timestamp}
                valueFormatter={props.valueFormatter}
            />

            <MetricChart
                data={props.data}
                valueFormatter={props.valueFormatter}
            />
        </div>
    )
}

export function MetricGridFallback({
    title,
}: {
    title: string
}): React.ReactElement {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MetricCardFallback title={title} />
            <MetricChartFallback />
        </div>
    )
}
