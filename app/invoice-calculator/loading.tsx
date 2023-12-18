import CalculatorSelectorPlaceholder from "@/app/invoice-calculator/calculator-selector-placeholder"
import { Card, Text, Title } from "@tremor/react"

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
