import {Card, Flex, Metric, Text} from "@tremor/react"

export interface MetricCardProps {
    title: string
    value: number
    lastUpdated: Date
    valueFormatter?: (value: number) => string
}

export default function MetricCard(props: MetricCardProps): React.ReactElement {
    let formatter = props.valueFormatter ?? ((value: number) => value.toLocaleString("id-ID"))

    return (
        <Card>
            <Flex alignItems="start">
                <div className="truncate">
                    <Text>{props.title}</Text>
                    <Metric className="truncate">{formatter(props.value)}</Metric>
                </div>
            </Flex>

            <Flex className="absolute bottom-0 py-6">
                <Text>Terakhir diperbarui: {props.lastUpdated.toLocaleString("id-ID")}</Text>
            </Flex>
        </Card>
    )
}