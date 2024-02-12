import { Flex, Subtitle, Text } from "@tremor/react"

export function StockCard({
    stocks,
}: {
    stocks: string[]
}): React.ReactElement {
    return (
        <Flex flexDirection="col" alignItems="start" className="mr-4">
            <Subtitle>Sisa Stok</Subtitle>
            <Text>
                {stocks.length === 0 ? "Tidak ada stok" : stocks.join(" ")}
            </Text>
        </Flex>
    )
}
