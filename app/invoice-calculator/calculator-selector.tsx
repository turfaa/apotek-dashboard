"use client"

import { useCalculator } from "@/app/invoice-calculator/calculator-hook"
import CalculatorSelectorPlaceholder from "@/app/invoice-calculator/calculator-selector-placeholder"
import { InvoiceCalculator } from "@/lib/api/invoice-calculator"
import { SearchSelect, SearchSelectItem } from "@tremor/react"
import { useEffect, useMemo, useState } from "react"

export interface CalculatorSelectorProps {
    calculators: InvoiceCalculator[]
}

export default function CalculatorSelector({ calculators }: CalculatorSelectorProps): React.ReactElement {
    const calculator = useCalculator(state => state.calculator)
    const setCalculator = useCalculator(state => state.setCalculator)

    const calculatorBySupplier: Record<string, InvoiceCalculator> = useMemo(() => {
        return calculators.reduce((acc, calc) => {
            acc[calc.supplier] = calc
            return acc
        }, {} as Record<string, InvoiceCalculator>)
    }, [calculators])


    const [hasHydrated, setHasHydrated] = useState(false)
    useEffect(() => {
        setHasHydrated(true)
    }, [])

    if (!hasHydrated) {
        return <CalculatorSelectorPlaceholder />
    }


    return (
        <SearchSelect
            value={calculator?.supplier ?? ""}
            onValueChange={(supplier) => setCalculator(calculatorBySupplier[supplier])}
            placeholder="Pilih supplier..."
        >
            {calculators.map((calculator) => (
                <SearchSelectItem key={calculator.supplier} value={calculator.supplier}>
                    {calculator.supplier}
                </SearchSelectItem>
            ))}
        </SearchSelect>
    )
}