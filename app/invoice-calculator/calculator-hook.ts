import {
    InvoiceCalculator,
    InvoiceComponent,
} from "@/lib/api/invoice-calculator"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export interface CalculatorHook {
    calculator?: InvoiceCalculator
    setCalculator: (calculator: InvoiceCalculator) => void

    invoices: Invoice[]
    addInvoice: () => void
    removeInvoice: (index: number) => void
    updateInvoice: (index: number, newInvoice: Invoice) => void
}

export interface Invoice {
    components: ComponentWithAmount[]
    ignoreMultiplier: boolean
}

export interface ComponentWithAmount extends InvoiceComponent {
    amount: number
}

export const useCalculator = create<CalculatorHook>()(
    devtools(
        persist(
            (set) => ({
                invoices: [] as Invoice[],

                setCalculator: (calculator) =>
                    set((state) => {
                        if (calculator.supplier == state.calculator?.supplier) {
                            return {}
                        }

                        const invoices = calculator
                            ? [newInvoice(calculator)]
                            : []
                        return { calculator, invoices }
                    }),

                addInvoice: () =>
                    set((state) => {
                        if (!state.calculator) {
                            return {}
                        }

                        return {
                            invoices: [
                                ...state.invoices,
                                newInvoice(state.calculator),
                            ],
                        }
                    }),

                removeInvoice: (index: number) =>
                    set((state) => ({
                        invoices: [
                            ...state.invoices.slice(0, index),
                            ...state.invoices.slice(index + 1),
                        ],
                    })),

                updateInvoice: (index: number, newInvoice: Invoice) =>
                    set((state) => ({
                        invoices: [
                            ...state.invoices.slice(0, index),
                            newInvoice,
                            ...state.invoices.slice(index + 1),
                        ],
                    })),
            }),
            {
                name: "calculator",
            },
        ),
    ),
)

function newInvoice(calculator: InvoiceCalculator): Invoice {
    return {
        components: calculator.components.map((c) => ({ ...c, amount: 0 })),
        ignoreMultiplier: false,
    }
}
