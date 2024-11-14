"use client"

import { Drug, getDrugs } from "@/lib/api/drugv2"
import Link from 'next/link'
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Text, Bold } from "@/components/typography"
import { useMemo, useState, useEffect } from "react"
import { useTf } from "@/lib/tf/hook"
import useSearch from "@/lib/search-hook"
import { Session } from "next-auth"
import { useDebounce } from "use-debounce"
import { Role } from "@/lib/api/auth"
import { PriceListTableBodyFallback } from "./table-fallback"
import PriceListCard from "./card"

const rolesAllowedToSeeDrugCost = [Role.ADMIN, Role.STAFF]
const refreshInterval = 10000 // 10 seconds

export interface PriceListTableBodyProps {
    session: Session | null
    initialDrugs: Drug[]
}

export default function PriceListTableBody({ session, initialDrugs }: PriceListTableBodyProps): React.ReactElement {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    const [drugs, setDrugs] = useState(initialDrugs)

    useEffect(() => setSsrCompleted(true), [])

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await getDrugs(session)
                setDrugs(response.drugs)
            } catch (error) {
                console.error("Failed to fetch updated drugs:", error)
            }
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [session])

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

    const allowedToSeeDrugCost = rolesAllowedToSeeDrugCost.includes(session?.user?.role ?? Role.GUEST)

    return (
        <TableBody>
            {filtered.map((drug) => (
                <TableRow key={drug.vmedisCode}>
                    <TableCell className="flex flex-col gap-4 py-4">
                        <Bold className="text-sm">{drug.name}</Bold>

                        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                            {drug.sections.map((section) => (
                                <PriceListCard key={section.title} title={section.title} rows={section.rows} />
                            ))}
                        </div>

                        {allowedToSeeDrugCost && (
                            <Link href={`/procurements/by-drug?drug-code=${drug.vmedisCode}`} target="_blank">
                                <Text>Lihat harga pembelian obat terakhir</Text>
                            </Link>
                        )}
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    )
}
