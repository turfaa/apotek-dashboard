import Calculator from "./calculator"
import CalculatorSelector from "./calculator-selector"
import { GetInvoiceCalculators } from "@/lib/api/invoice-calculator"
import { Card } from "@/components/ui/card"
import { Title } from "@/components/typography"

export default async function InvoiceCalculator(): Promise<React.ReactElement> {
    const { calculators } = await GetInvoiceCalculators()

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title className="mb-4">Kalkulator Faktur</Title>

            <CalculatorSelector calculators={calculators} />

            <Card className="mt-4 p-6">
                <Calculator />
            </Card>
        </main>
    )
}
