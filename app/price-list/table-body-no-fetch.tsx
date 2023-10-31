"use client"

import { Role } from "@/lib/api/auth"
import { DrugWithUnits, Unit } from "@/lib/api/drug"
import useSearch from "@/lib/search-hook"
import { Bold, Flex, Grid, Subtitle, TableBody, TableCell, TableRow, Text } from "@tremor/react"
import { Session } from "next-auth"
import { useMemo } from "react"

export interface PriceListTableBodyNoFetchProps {
    session: Session | null
    drugs: DrugWithUnits[]
}

const rupiah = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" })

const rolesAllowedToSeeDiscountedPrice = [Role.ADMIN, Role.STAFF, Role.RESELLER]
const rolesAllowedToSeePrescriptionPrice = [Role.ADMIN, Role.STAFF]

export default function PriceListTableBodyNoFetch({ session, drugs }: PriceListTableBodyNoFetchProps): React.ReactElement {
    const { query } = useSearch()
    const filtered = useMemo(() => drugs.filter(drug => drug.name.toLowerCase().includes(query.toLowerCase())) ?? [], [drugs, query])

    const allowedToSeeDiscountedPrice = rolesAllowedToSeeDiscountedPrice.includes(session?.user?.role ?? Role.GUEST)
    const allowedToSeePrescriptionPrice = rolesAllowedToSeePrescriptionPrice.includes(session?.user?.role ?? Role.GUEST)

    return (
        <TableBody>
            {filtered.map((drug, index) => (
                <TableRow key={index}>
                    <TableCell className="flex flex-col gap-4">
                        <Bold>{drug.name}</Bold>

                        <Grid numItemsSm={1} numItemsMd={3} className="gap-4">
                            <PriceCard title="Harga Normal" units={drug.units} priceGetter={normalPriceGetter} />

                            {allowedToSeeDiscountedPrice && (
                                <PriceCard
                                    title="Harga Diskon"
                                    units={drug.units}
                                    priceGetter={discountPriceGetter}
                                />
                            )}

                            {allowedToSeePrescriptionPrice && (
                                <PriceCard
                                    title="Harga Resep"
                                    units={drug.units}
                                    priceGetter={prescriptionPriceGetter}
                                />
                            )}
                        </Grid>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}

function PriceCard({ title, units, priceGetter }: {
    title: string,
    units: Unit[],
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

                return (
                    <Text key={index}>{text}</Text>
                )
            })}
        </Flex>
    )
}

function normalPriceGetter(unit: Unit): number {
    return unit.priceOne
}

function discountPriceGetter(unit: Unit): number {
    return unit.priceTwo
}

function prescriptionPriceGetter(unit: Unit): number {
    return unit.priceThree
}