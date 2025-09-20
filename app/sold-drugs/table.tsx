"use client"

import { SoldDrug } from "@/lib/api/sold-drug"
import { rupiah } from "@/lib/rupiah"
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useMemo, use } from "react"
import { useDebounce } from "use-debounce"
import useSearch from "@/lib/search-hook"
import { useTf } from "@/lib/tf/hook"

export interface SoldDrugsTableProps {
    drugsPromise: Promise<SoldDrug[]>
}

export default function SoldDrugsTable({
    drugsPromise,
}: SoldDrugsTableProps): React.ReactElement {
    const { query } = useSearch()
    const [debouncedQuery] = useDebounce(query, 300)
    const drugs = use(drugsPromise)

    const [drugIds, drugSearchTexts, drugById] = useMemo(() => {
        return [
            drugs.map((d) => d.drug.vmedisCode),
            drugs.map((d) => d.drug.name),
            new Map(drugs.map((d) => [d.drug.vmedisCode, d])),
        ]
    }, [drugs])

    const { search } = useTf(drugIds, drugSearchTexts)

    const filteredDrugs = useMemo(() => {
        if (debouncedQuery.length < 3) {
            return drugs
        }

        return search(debouncedQuery).map((vmedisCode) =>
            drugById.get(vmedisCode),
        ) as SoldDrug[]
    }, [drugs, debouncedQuery, search, drugById])

    const totalPrice = filteredDrugs.reduce(
        (total, drug) => total + drug.totalAmount,
        0,
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Pabrik</TableHead>
                    <TableHead>Terjual</TableHead>
                    <TableHead>Total Harga</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {filteredDrugs.map((drug, index) => (
                    <TableRow key={index}>
                        <TableHead>{index + 1}</TableHead>
                        <TableCell>{drug.drug.name}</TableCell>
                        <TableCell>{drug.drug.manufacturer}</TableCell>
                        <TableCell>
                            {drug.occurrences.toLocaleString("id-ID")} Kali
                        </TableCell>
                        <TableCell>{rupiah.format(drug.totalAmount)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell>{rupiah.format(totalPrice)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
