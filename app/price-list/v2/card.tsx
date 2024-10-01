import { Flex, Subtitle, Text } from "@tremor/react"

export interface PriceListCardProps {
    title: string
    rows: string[]
}

export default function PriceListCard({ title, rows }: PriceListCardProps): React.ReactElement {
    return (
        <Flex flexDirection="col" alignItems="start" className="mr-4">
            <Subtitle>{title}</Subtitle>
            {rows.map((text) => (
                <Text key={text}>{text}</Text>
            ))}
        </Flex>
    )
}
