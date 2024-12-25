"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getStockOpnameSummaries } from "@/lib/api/stock-opname"
import { rupiah } from "@/lib/rupiah"
import { SearchParams } from "@/types/search-params"
import { useMemo, use } from "react"
import { useDebounce } from "use-debounce"
import useSearch from "@/lib/search-hook"
import { useTf } from "@/lib/tf/hook"

export interface StockOpnameSummaryTableProps {
    summariesPromise: Promise<{
        drugName: string
        drugCode: string
        unit: string
        changes: {
            batchCode: string
            initialQuantity: number
            realQuantity: number
        }[]
        quantityDifference: number
        hppDifference: number
        salePriceDifference: number
    }[]>
}

export default function StockOpnameSummaryTable({ summariesPromise }: StockOpnameSummaryTableProps): React.ReactElement {
    const { query } = useSearch()
    const [debouncedQuery] = useDebounce(query, 300)
    const summaries = use(summariesPromise)

    const [drugIds, drugSearchTexts, drugById] = useMemo(() => {
        return [
            summaries.map((d) => d.drugCode),
            summaries.map((d) => d.drugName),
            new Map(summaries.map((d) => [d.drugCode, d])),
        ]
    }, [summaries])

    const { search } = useTf(drugIds, drugSearchTexts)

    const filteredSummaries = useMemo(() => {
        if (debouncedQuery.length < 3) {
            return summaries
        }

        return search(debouncedQuery).map((drugCode) =>
            drugById.get(drugCode),
        ) as typeof summaries
    }, [summaries, debouncedQuery, search, drugById])

    const totalHppDifference = filteredSummaries.reduce(
        (total, stockOpname) => total + stockOpname.hppDifference,
        0,
    )
    const totalSalePriceDifference = filteredSummaries.reduce(
        (total, stockOpname) => total + stockOpname.salePriceDifference,
        0,
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Perubahan Stok</TableHead>
                    <TableHead>Selisih Stok</TableHead>
                    <TableHead>Selisih HPP</TableHead>
                    <TableHead>Selisih Harga Jual</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {filteredSummaries.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.drugName}</TableCell>
                        <TableCell className="flex flex-col items-start">
                            {row.changes.map((change, changeIndex) => (
                                <span key={changeIndex}>
                                    {change.initialQuantity} {row.unit}{" "}
                                    {"->"} {change.realQuantity} {row.unit}{" "}
                                    [{change.batchCode}]{" "}
                                </span>
                            ))}
                        </TableCell>
                        <TableCell>
                            {row.quantityDifference} {row.unit}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(row.hppDifference)}
                        </TableCell>
                        <TableCell>
                            {rupiah.format(row.salePriceDifference)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell>{rupiah.format(totalHppDifference)}</TableCell>
                    <TableCell>
                        {rupiah.format(totalSalePriceDifference)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
