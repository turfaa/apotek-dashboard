import {Grid} from "@tremor/react"
import MetricCard from "@/app/metric-card"
import MetricChart from "@/app/metric-chart";

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
    const latest: Datum = props.data[props.data.length - 1] ?? {value: 0, timestamp: new Date()}

    return (
        <Grid numItemsSm={1} numItemsLg={2} className="gap-6 mt-6">
            <MetricCard
                title={props.title}
                value={latest.value}
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