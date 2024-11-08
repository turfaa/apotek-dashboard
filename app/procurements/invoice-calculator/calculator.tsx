"use client"

import {
    calculateInvoices,
    calculateInvoicesWithoutMultiplier,
} from "./calculate"
import { useCalculator } from "./calculator-hook"
import InvoiceCard from "./invoice-card"
import { rupiah } from "@/lib/rupiah"
import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Title, Text, Bold, Metric } from "@/components/typography"
import { useEffect, useMemo, useState } from "react"

export default function Calculator(): React.ReactElement {
    const calculator = useCalculator((state) => state.calculator)
    const invoices = useCalculator((state) => state.invoices)
    const addInvoice = useCalculator((state) => state.addInvoice)
    const updateInvoice = useCalculator((state) => state.updateInvoice)
    const removeInvoice = useCalculator((state) => state.removeInvoice)

    const totalPrice = useMemo(
        () => calculateInvoices(invoices, calculator?.shouldRound ?? false),
        [invoices, calculator],
    )

    const totalDiscount = useMemo(
        () => calculateInvoicesWithoutMultiplier(invoices) - totalPrice,
        [invoices, totalPrice],
    )

    const hasDiscount = totalDiscount != 0

    const [hasHydrated, setHasHydrated] = useState(false)
    useEffect(() => {
        setHasHydrated(true)
    }, [])

    if (!hasHydrated) {
        return <Text>Tunggu sebentar...</Text>
    }

    if (!calculator) {
        return <Text>Silakan pilih supplier terlebih dahulu...</Text>
    }

    return (
        <div className="flex w-full flex-col items-start">
            {invoices.map((invoice, index) => (
                <div key={index} className="w-full">
                    <InvoiceCard
                        title={`Faktur #${index + 1}`}
                        invoice={invoice}
                        shouldRound={calculator.shouldRound}
                        updateInvoice={(iv) => updateInvoice(index, iv)}
                        removeInvoice={() => removeInvoice(index)}
                    />

                    <Separator className="my-4" />
                </div>
            ))}

            <Button
                variant="link"
                onClick={addInvoice}
                className="self-end px-0"
            >
                <PlusIcon className="mr-2 h-4 w-4" />
                Tambah Faktur
            </Button>

            <Separator className="my-4" />

            {hasDiscount && (
                <div className="flex w-full flex-row justify-between">
                    <Bold>Total Diskon</Bold>
                    <Title>{rupiah.format(totalDiscount)}</Title>
                </div>
            )}

            <div className="flex w-full flex-row justify-between">
                <Bold>Total Bayar</Bold>
                <Metric>{rupiah.format(totalPrice)}</Metric>
            </div>
        </div>
    )
}
