import {
    calculateInvoice,
    calculateInvoiceWithoutMultiplier,
} from "@/app/invoice-calculator/calculate"
import { Invoice } from "@/app/invoice-calculator/calculator-hook"
import { rupiah } from "@/lib/rupiah"
import { TrashIcon } from "@heroicons/react/24/outline"
import { maskitoTransform } from "@maskito/core"
import { maskitoNumberOptionsGenerator, maskitoParseNumber } from "@maskito/kit"
import { useMaskito } from "@maskito/react"
import {
    Bold,
    Button,
    Flex,
    Switch,
    Text,
    TextInputProps,
    Title,
    TextInput as UnderlyingTextInput,
} from "@tremor/react"
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
    precision: 2,
    decimalZeroPadding: true,
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
        <Flex flexDirection="col" alignItems="start" className="gap-2">
            <Flex>
                <Title>{title}</Title>
                <Button
                    icon={TrashIcon}
                    variant="light"
                    size="xs"
                    onClick={removeInvoice}
                    color="red"
                >
                    Hapus
                </Button>
            </Flex>

            {invoice.components.map((component, index) => (
                <Flex key={index}>
                    <Text>{component.name}</Text>

                    <TextInput
                        className="max-w-xs"
                        value={maskitoTransform(
                            component.amount.toString().replace(".", ","),
                            maskitoOptions,
                        )}
                        onFocus={(e) => e.currentTarget.select()}
                        onInput={(e) => {
                            let amount = maskitoParseNumber(
                                e.currentTarget.value,
                                ",",
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
                </Flex>
            ))}

            {hasDiscount && (
                <Flex>
                    <Text>Pakai Diskon</Text>

                    <Switch
                        checked={!invoice.ignoreMultiplier}
                        onChange={(selected) => {
                            updateInvoice({
                                ...invoice,
                                ignoreMultiplier: !selected,
                            })
                        }}
                    />
                </Flex>
            )}

            {hasDiscount && !invoice.ignoreMultiplier && (
                <Flex>
                    <Text>Total Diskon</Text>
                    <Text>{rupiah.format(totalDiscount)}</Text>
                </Flex>
            )}

            <Flex className="mt-4">
                <Bold>Total Input di Vmedis</Bold>
                <Bold>{rupiah.format(totalPrice)}</Bold>
            </Flex>
        </Flex>
    )
}

function TextInput(props: TextInputProps): React.ReactElement {
    const rupiahMask = useMaskito({ options: maskitoOptions })

    return <UnderlyingTextInput {...props} ref={rupiahMask} />
}
