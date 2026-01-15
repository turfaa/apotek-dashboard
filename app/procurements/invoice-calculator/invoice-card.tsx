import {
    calculateInvoice,
    calculateInvoiceWithoutMultiplier,
} from "./calculate"
import { Invoice } from "./calculator-hook"
import { rupiah } from "@/lib/rupiah"
import { TrashIcon } from "@radix-ui/react-icons"
import { maskitoTransform } from "@maskito/core"
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from "@maskito/kit"
import { useMaskito } from "@maskito/react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Title, Text, Bold } from "@/components/typography"
import { useMemo } from "react"

export interface InvoiceCardProps {
    title: string
    invoice: Invoice
    shouldRound: boolean
    updateInvoice: (invoice: Invoice) => void
    removeInvoice: () => void
}

const maskitoOptions = maskitoNumberOptionsGenerator({
    prefix: "Rp ",
    decimalSeparator: ",",
    thousandSeparator: ".",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
})

export default function InvoiceCard({
    title,
    invoice,
    shouldRound,
    updateInvoice,
    removeInvoice,
}: InvoiceCardProps): React.ReactElement {
    const totalPrice = useMemo(
        () => calculateInvoice(invoice, shouldRound),
        [invoice, shouldRound],
    )

    const totalDiscount = useMemo(
        () => calculateInvoiceWithoutMultiplier(invoice) - totalPrice,
        [totalPrice, invoice],
    )

    const hasDiscount = useMemo(
        () => invoice.components.some((c) => c.multiplier < 1),
        [invoice],
    )

    return (
        <div className="flex flex-col items-start gap-2">
            <div className="flex justify-between w-full">
                <Title>{title}</Title>
                <Button variant="destructive" size="sm" onClick={removeInvoice}>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Hapus
                </Button>
            </div>

            {invoice.components.map((component, index) => (
                <div
                    key={index}
                    className="flex justify-between w-full items-center"
                >
                    <Text>{component.name}</Text>

                    <RupiahInput
                        className="max-w-xs"
                        value={maskitoTransform(
                            component.amount.toString().replace(".", ","),
                            maskitoOptions,
                        )}
                        onFocus={(e) => e.currentTarget.select()}
                        onInput={(e) => {
                            let amount = maskitoParseNumber(
                                e.currentTarget.value,
                                { decimalSeparator: "," },
                            )
                            if (isNaN(amount)) {
                                amount = 0
                            }

                            updateInvoice({
                                ...invoice,
                                components: invoice.components.map((c, i) => {
                                    if (i === index) {
                                        return { ...c, amount }
                                    }
                                    return c
                                }),
                            })
                        }}
                    />
                </div>
            ))}

            {hasDiscount && (
                <div className="flex justify-between w-full items-center">
                    <Text>Pakai Diskon</Text>

                    <Switch
                        checked={!invoice.ignoreMultiplier}
                        onCheckedChange={(checked) => {
                            updateInvoice({
                                ...invoice,
                                ignoreMultiplier: !checked,
                            })
                        }}
                    />
                </div>
            )}

            {hasDiscount && !invoice.ignoreMultiplier && (
                <div className="flex justify-between w-full">
                    <Text>Total Diskon</Text>
                    <Text>{rupiah.format(totalDiscount)}</Text>
                </div>
            )}

            <div className="flex justify-between w-full mt-4">
                <Bold>Total Input di Vmedis</Bold>
                <Bold>{rupiah.format(totalPrice)}</Bold>
            </div>
        </div>
    )
}

function RupiahInput(
    props: React.ComponentProps<typeof Input>,
): React.ReactElement {
    const rupiahMask = useMaskito({ options: maskitoOptions })
    return <Input {...props} ref={rupiahMask} />
}
