import Calculator from "@/app/invoice-calculator/calculator"
import CalculatorSelector from "@/app/invoice-calculator/calculator-selector"
import { GetInvoiceCalculators } from "@/lib/api/invoice-calculator"
import { Card, Title } from "@tremor/react"

export default async function InvoiceCalculator(): Promise<React.ReactElement> {
    const { calculators } = await GetInvoiceCalculators()

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Kalkulator Faktur</Title>

            <CalculatorSelector calculators={calculators} />

            <Card className="mt-4">
                <Calculator />
            </Card>
        </main>
    )
}