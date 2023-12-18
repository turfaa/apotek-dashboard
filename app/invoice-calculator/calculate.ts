import { Invoice } from "@/app/invoice-calculator/calculator-hook"

export function calculateInvoices(
    invoices: Invoice[],
    shouldRound: boolean,
): number {
    return invoices.reduce(
        (acc, invoice) => acc + calculateInvoice(invoice, shouldRound),
        0,
    )
}

export function calculateInvoice(
    invoice: Invoice,
    shouldRound: boolean,
): number {
    const total = invoice.components.reduce(
        (acc, c) =>
            acc + c.amount * (invoice.ignoreMultiplier ? 1 : c.multiplier),
        0,
    )
    return shouldRound ? Math.ceil(total) : total
}
