import { Card } from "@/components/ui/card"
import { Text, Metric } from "@/components/typography"
import { Skeleton } from "@/components/ui/skeleton"

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
        <Card className="relative p-6 min-h-[180px]">
            <div className="flex items-start mb-12">
                <div className="truncate">
                    <Text>{props.title}</Text>
                    <Metric className="truncate">
                        {formatter(props.value)}
                    </Metric>
                </div>
            </div>

            <div className="absolute bottom-0 py-6">
                <Text className="text-sm">
                    Terakhir diperbarui:{" "}
                    {props.lastUpdated.toLocaleString("id-ID")}
                </Text>
            </div>
        </Card>
    )
}

export function MetricCardFallback({ title }: { title: string }): React.ReactElement {
    return (
        <Card className="relative p-6 min-h-[180px]">
            <div className="flex items-start mb-12">
                <div className="space-y-2">
                    <Text>{title}</Text>
                    <Skeleton className="h-8 w-[180px]" />
                </div>
            </div>

            <div className="absolute bottom-0 py-6">
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </Card>
    )
}
