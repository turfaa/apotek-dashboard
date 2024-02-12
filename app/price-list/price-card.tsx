"use client"
import { Unit } from "@/lib/api/drug"
import { rupiah } from "@/lib/rupiah"
import { Flex, Subtitle, Text } from "@tremor/react"

export function PriceCard({
    title,
    units,
    priceGetter,
}: {
    title: string
    units: Unit[]
    priceGetter: (unit: Unit) => number
}): React.ReactElement {
    return (
        <Flex flexDirection="col" alignItems="start" className="mr-4">
            <Subtitle>{title}</Subtitle>

            {units.map((unit, index) => {
                let text = `${rupiah.format(priceGetter(unit))} / ${unit.unit}`
                if (unit.conversionToParentUnit) {
                    text += ` (${unit.conversionToParentUnit} ${unit.parentUnit})`
                }

                return <Text key={index}>{text}</Text>
            })}
        </Flex>
    )
}
export function normalPriceGetter(unit: Unit): number {
    return unit.priceOne
}
export function discountPriceGetter(unit: Unit): number {
    return unit.priceTwo
}
export function prescriptionPriceGetter(unit: Unit): number {
    return unit.priceThree
}
