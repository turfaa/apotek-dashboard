"use client"

import { useCalculator } from "./calculator-hook"
import CalculatorSelectorPlaceholder from "./calculator-selector-placeholder"
import { InvoiceCalculator } from "@/lib/api/invoice-calculator"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"

export interface CalculatorSelectorProps {
    calculators: InvoiceCalculator[]
}

export default function CalculatorSelector({
    calculators,
}: CalculatorSelectorProps): React.ReactElement {
    const calculator = useCalculator((state) => state.calculator)
    const setCalculator = useCalculator((state) => state.setCalculator)
    const [open, setOpen] = useState(false)

    const calculatorBySupplier: Record<string, InvoiceCalculator> =
        useMemo(() => {
            return calculators.reduce(
                (acc, calc) => {
                    acc[calc.supplier] = calc
                    return acc
                },
                {} as Record<string, InvoiceCalculator>,
            )
        }, [calculators])

    const [hasHydrated, setHasHydrated] = useState(false)
    useEffect(() => {
        setHasHydrated(true)
    }, [])

    if (!hasHydrated) {
        return <CalculatorSelectorPlaceholder />
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {calculator?.supplier ?? "Pilih supplier..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command className="w-full">
                    <CommandInput placeholder="Cari supplier..." />
                    <CommandEmpty>Supplier tidak ditemukan.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {calculators.map((calc) => (
                            <CommandItem
                                key={calc.supplier}
                                value={calc.supplier}
                                onSelect={(supplier) => {
                                    setCalculator(calculatorBySupplier[supplier])
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        calculator?.supplier === calc.supplier ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {calc.supplier}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
