"use client"

import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"
import { getDrugs, Unit } from "@/lib/api/drug"
import { useDrugs } from "@/lib/api/hooks"
import { rupiah } from "@/lib/rupiah"
import useSearch from "@/lib/search-hook"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import { Callout, Col, Flex, Grid, Subtitle, TableBody, TableCell, TableRow, Text } from "@tremor/react"
import { useEffect, useState } from "react"
import { preload } from "swr"

preload("/drugs", getDrugs)

export default function PriceListTableBody(): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    useEffect(() => setSsrCompleted(true), [])

    const { query } = useSearch()
    const { data, isLoading, error } = useDrugs()

    if (isLoading || !ssrCompleted) {
        return <PriceListTableBodyFallback />
    }

    if (error) {
        return (
            <Callout
                className="h-12 mt-4"
                title={error.message}
                icon={ExclamationTriangleIcon}
                color="rose"
            />
        )
    }

    const drugs = data?.drugs.filter(drug => drug.name.toLowerCase().includes(query.toLowerCase())) ?? []

    return (
        <TableBody>
            {drugs.map((drug, index) => (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                        <Flex flexDirection="col" alignItems="start" className="gap-4">
                            <Text>{drug.name}</Text>

                            <Grid numItemsSm={1} numItemsMd={3} className="gap-4">
                                <Col>
                                    <PriceCard title="Harga Normal" units={drug.units} priceGetter={normalPriceGetter} />
                                </Col>

                                <Col>
                                    <PriceCard
                                        title="Harga Diskon"
                                        units={drug.units}
                                        priceGetter={discountPriceGetter}
                                    />
                                </Col>

                                <Col>
                                    <PriceCard
                                        title="Harga Resep"
                                        units={drug.units}
                                        priceGetter={prescriptionPriceGetter}
                                    />
                                </Col>
                            </Grid>
                        </Flex>
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

            {units.map((unit, index) => (
                <Text key={index}>
                    {rupiah.format(priceGetter(unit))} / {unit.unit}
                    {!!unit.parentUnit && <> ({unit.conversionToParentUnit} {unit.parentUnit})</>}
                </Text>
            ))}
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