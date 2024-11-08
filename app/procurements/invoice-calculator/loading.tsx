import CalculatorSelectorPlaceholder from "./calculator-selector-placeholder"
import { Card } from "@tremor/react"
import { Title, Text } from "@/components/typography"

export default function InvoiceCalculator(): React.ReactElement {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Kalkulator Faktur</Title>

            <CalculatorSelectorPlaceholder />

            <Card className="mt-4">
                <Text>Silakan pilih supplier terlebih dahulu...</Text>
            </Card>
        </main>
    )
}
