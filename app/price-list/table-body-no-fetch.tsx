"use client"

import { Role } from "@/lib/api/auth"
import { Drug } from "@/lib/api/drug"
import useSearch from "@/lib/search-hook"
import { Bold, Grid, TableBody, TableCell, TableRow } from "@tremor/react"
import { Session } from "next-auth"
import { useEffect, useMemo, useState } from "react"

import {
    PriceCard,
    discountPriceGetter,
    normalPriceGetter,
    prescriptionPriceGetter,
} from "./price-card"
import { StockCard } from "./stock-card"
import PriceListTableBodyFallback from "./table-body-fallback"

export interface PriceListTableBodyNoFetchProps {
    session: Session | null
    drugs: Drug[]
}

const rolesAllowedToSeeDiscountedPrice = [Role.ADMIN, Role.STAFF, Role.RESELLER]
const rolesAllowedToSeePrescriptionPrice = [Role.ADMIN, Role.STAFF]
const rolesAllowedToSeeStock = [
    Role.ADMIN,
    Role.STAFF,
    Role.RESELLER,
    Role.GUEST,
]

export default function PriceListTableBodyNoFetch({
    session,
    drugs,
}: PriceListTableBodyNoFetchProps): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    useEffect(() => setSsrCompleted(true), [])

    const { query } = useSearch()
    const filtered = useMemo(
        () =>
            drugs.filter((drug) =>
                drug.name.toLowerCase().includes(query.toLowerCase()),
            ) ?? [],
        [drugs, query],
    )

    if (!ssrCompleted) {
        return <PriceListTableBodyFallback />
    }

    const allowedToSeeDiscountedPrice =
        rolesAllowedToSeeDiscountedPrice.includes(
            session?.user?.role ?? Role.GUEST,
        )

    const allowedToSeePrescriptionPrice =
        rolesAllowedToSeePrescriptionPrice.includes(
            session?.user?.role ?? Role.GUEST,
        )

    const allowedToSeeStock = rolesAllowedToSeeStock.includes(
        session?.user?.role ?? Role.GUEST,
    )

    return (
        <TableBody>
            {filtered.map((drug) => (
                <TableRow key={drug.vmedisCode}>
                    <TableCell className="flex flex-col gap-4">
                        <Bold>{drug.name}</Bold>

                        <Grid numItemsSm={1} numItemsMd={3} className="gap-4">
                            <PriceCard
                                title="Harga Normal"
                                units={drug.units}
                                priceGetter={normalPriceGetter}
                            />

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

                            {allowedToSeeStock && (
                                <StockCard stocks={drug.stocks} />
                            )}
                        </Grid>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
