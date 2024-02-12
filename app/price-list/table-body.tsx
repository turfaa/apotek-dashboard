"use client"

import PriceListTableBodyFallback from "@/app/price-list/table-body-fallback"
import { getDrugs } from "@/lib/api/drug"
import { useDrugs } from "@/lib/api/hooks"
import useSearch from "@/lib/search-hook"
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid"
import {
    Callout,
    Col,
    Flex,
    Grid,
    TableBody,
    TableCell,
    TableRow,
    Text,
} from "@tremor/react"
import { useEffect, useState } from "react"
import { preload } from "swr"

import {
    PriceCard,
    discountPriceGetter,
    normalPriceGetter,
    prescriptionPriceGetter,
} from "./price-card"

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

    const drugs =
        data?.drugs.filter((drug) =>
            drug.name.toLowerCase().includes(query.toLowerCase()),
        ) ?? []

    return (
        <TableBody>
            {drugs.map((drug, index) => (
                <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-4"
                        >
                            <Text>{drug.name}</Text>

                            <Grid
                                numItemsSm={1}
                                numItemsMd={3}
                                className="gap-4"
                            >
                                <Col>
                                    <PriceCard
                                        title="Harga Normal"
                                        units={drug.units}
                                        priceGetter={normalPriceGetter}
                                    />
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
