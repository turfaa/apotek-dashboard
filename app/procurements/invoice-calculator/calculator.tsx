"use client"

import {
    calculateInvoices,
    calculateInvoicesWithoutMultiplier,
} from "./calculate"
import { useCalculator } from "./calculator-hook"
import InvoiceCard from "./invoice-card"
import { rupiah } from "@/lib/rupiah"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Bold, Button, Divider, Flex, Metric, Text, Title } from "@tremor/react"
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
        <Flex flexDirection="col" alignItems="start">
            {invoices.map((invoice, index) => (
                <div key={index} className="w-full">
                    <InvoiceCard
                        title={`Faktur #${index + 1}`}
                        invoice={invoice}
                        shouldRound={calculator.shouldRound}
                        updateInvoice={(iv) => updateInvoice(index, iv)}
                        removeInvoice={() => removeInvoice(index)}
                    />

                    <Divider />
                </div>
            ))}

            <Button
                icon={PlusIcon}
                size="xs"
                variant="light"
                onClick={addInvoice}
                className="self-end"
            >
                Tambah Faktur
            </Button>

            <Divider />

            {hasDiscount && (
                <Flex flexDirection="row" justifyContent="between">
                    <Bold>Total Diskon</Bold>
                    <Title>{rupiah.format(totalDiscount)}</Title>
                </Flex>
            )}

            <Flex flexDirection="row" justifyContent="between">
                <Bold>Total Bayar</Bold>
                <Metric>{rupiah.format(totalPrice)}</Metric>
            </Flex>
        </Flex>
    )
}
