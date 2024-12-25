import Calculator from "./calculator"
import CalculatorSelector from "./calculator-selector"
import { GetInvoiceCalculators } from "@/lib/api/invoice-calculator"
import { Card } from "@/components/ui/card"
import { Title, Subtitle } from "@/components/typography/v2"

export default async function InvoiceCalculator(): Promise<React.ReactElement> {
    const { calculators } = await GetInvoiceCalculators()

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="mb-4">
                <Title>Kalkulator Faktur</Title>
                <Subtitle>Hitung jumlah faktur yang harus di-input ke sistem</Subtitle>
            </div>

            <CalculatorSelector calculators={calculators} />

            <Card className="mt-4 p-6">
                <Calculator />
            </Card>
        </main>
    )
}
