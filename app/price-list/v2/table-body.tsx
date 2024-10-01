"use client"

import { Drug } from "@/lib/api/drugv2"
import { TableBody, TableCell, TableRow, Text } from "@tremor/react"
import { useMemo, useState, useEffect } from "react"
import { useTf } from "@/lib/tf/hook"
import { Bold, Grid } from "@tremor/react"
import useSearch from "@/lib/search-hook"
import { useDebounce } from "use-debounce"
import { PriceListTableBodyFallback } from "./table-fallback"
import PriceListCard from "./card"

export interface PriceListTableBodyProps {
    drugs: Drug[]
}

export default function PriceListTableBody({ drugs }: PriceListTableBodyProps): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    useEffect(() => setSsrCompleted(true), [])

    const { query } = useSearch()
    const [debouncedQuery] = useDebounce(query, 200)

    const [drugIds, drugSearchTexts, drugById] = useMemo(() => {
        return [
            drugs.map((d) => d.vmedisCode),
            drugs.map((d) => d.name),
            new Map(drugs.map((d) => [d.vmedisCode, d])),
        ]
    }, [drugs])

    const { search } = useTf(drugIds, drugSearchTexts)

    const filtered = useMemo(() => {
        if (debouncedQuery.length < 3) {
            return drugs
        }

        return search(debouncedQuery).map((vmedisCode) =>
            drugById.get(vmedisCode),
        ) as Drug[]
    }, [drugs, debouncedQuery, search, drugById])

    if (!ssrCompleted) {
        return <PriceListTableBodyFallback />
    }

    return (
        <TableBody>
            {filtered.map((drug) => (
                <TableRow key={drug.vmedisCode}>
                    <TableCell className="flex flex-col gap-4">
                        <Bold>{drug.name}</Bold>

                        <Grid numItemsSm={1} numItemsMd={3} className="gap-4">
                            {drug.sections.map((section) => (
                                <PriceListCard key={section.title} title={section.title} rows={section.rows} />
                            ))}
                        </Grid>
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
