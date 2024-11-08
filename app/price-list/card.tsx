import { Text, Subtitle } from "@/components/typography"

export interface PriceListCardProps {
    title: string
    rows: string[]
}

export default function PriceListCard({ title, rows }: PriceListCardProps): React.ReactElement {
    return (
        <div className="flex flex-col items-start mr-4 space-y-1.5">
            <Subtitle className="text-sm">{title}</Subtitle>
            {rows.map((text) => (
                <Text key={text} className="leading-none">{text}</Text>
            ))
            }
        </div >
    )
}
