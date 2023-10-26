import MetricCard from "@/app/statistics/metric-card"
import MetricChart from "@/app/statistics/metric-chart"
import { Grid } from "@tremor/react"

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
    const latest: Datum = props.data[props.data.length - 1] ?? { value: 0, timestamp: new Date() }

    let sum = 0
    for (let i = 0; i < props.data.length; i++) {
        if ((i == props.data.length - 1) || (props.data[i].timestamp.getDate() != props.data[i + 1].timestamp.getDate())) {
            sum += props.data[i].value
        }
    }

    return (
        <Grid numItemsSm={1} numItemsLg={2} className="gap-6 mt-6">
            <MetricCard
                title={props.title}
                value={sum}
                lastUpdated={latest.timestamp}
                valueFormatter={props.valueFormatter}
            />

            <MetricChart
                title={props.title}
                data={props.data}
                valueFormatter={props.valueFormatter}
            />
        </Grid>
    )
}