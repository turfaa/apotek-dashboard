import { Card } from "@/components/ui/card"
import { Text, Metric } from "@/components/typography"

export interface MetricCardProps {
    title: string
    value: number
    lastUpdated: Date
    valueFormatter?: (value: number) => string
}

export default function MetricCard(props: MetricCardProps): React.ReactElement {
    let formatter =
        props.valueFormatter ??
        ((value: number) => value.toLocaleString("id-ID"))

    return (
        <Card className="relative p-6">
            <div className="flex items-start">
                <div className="truncate">
                    <Text>{props.title}</Text>
                    <Metric className="truncate">
                        {formatter(props.value)}
                    </Metric>
                </div>
            </div>

            <div className="absolute bottom-0 py-6">
                <Text>
                    Terakhir diperbarui:{" "}
                    {props.lastUpdated.toLocaleString("id-ID")}
                </Text>
            </div>
        </Card>
    )
}
