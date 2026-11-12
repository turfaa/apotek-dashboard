"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Supplier } from "@/lib/api/supplier"
import useSearch from "@/lib/search-hook"
import { use, useMemo } from "react"
import { useDebounce } from "use-debounce"

const headers = ["No", "Kode", "Nama", "Alamat", "Telepon"]

export interface SuppliersTableProps {
    suppliersPromise: Promise<Supplier[]>
}

export default function SuppliersTable({
    suppliersPromise,
}: SuppliersTableProps): React.ReactElement {
    const suppliers = use(suppliersPromise)
    const { query } = useSearch()
    const [debouncedQuery] = useDebounce(query, 200)

    const searchTexts = useMemo(
        () =>
            suppliers.map((s) =>
                [s.code, s.name, s.address, s.city, s.phone, s.mobilePhone]
                    .join(" ")
                    .toLowerCase(),
            ),
        [suppliers],
    )

    const filtered = useMemo(() => {
        const terms = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean)
        if (terms.length === 0) {
            return suppliers
        }

        return suppliers.filter((_, i) =>
            terms.every((term) => searchTexts[i].includes(term)),
        )
    }, [suppliers, searchTexts, debouncedQuery])

    const lastSyncedAt = useMemo(() => {
        const times = suppliers.map((s) => new Date(s.updatedAt).getTime())
        return times.length > 0 ? new Date(Math.max(...times)) : null
    }, [suppliers])

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 px-4 py-3 border-b text-sm text-muted-foreground">
                <span>
                    {filtered.length === suppliers.length
                        ? `${suppliers.length} supplier`
                        : `${filtered.length} dari ${suppliers.length} supplier`}
                </span>
                {lastSyncedAt && (
                    <span>
                        Terakhir disinkronkan:{" "}
                        {lastSyncedAt.toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Asia/Jakarta",
                        })}
                    </span>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filtered.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={headers.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {suppliers.length === 0
                                    ? "Belum ada supplier. Tekan Sinkronkan untuk mengambil data dari Vmedis."
                                    : "Tidak ada supplier yang cocok."}
                            </TableCell>
                        </TableRow>
                    )}

                    {filtered.map((supplier, index) => (
                        <TableRow key={supplier.vmedisId}>
                            <TableCell className="w-12 text-muted-foreground">
                                {index + 1}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {supplier.code}
                            </TableCell>
                            <TableCell className="font-medium">
                                {supplier.name}
                            </TableCell>
                            <TableCell>
                                <div>{supplier.address}</div>
                                {supplier.city && (
                                    <div className="text-muted-foreground">
                                        {supplier.city}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {[supplier.phone, supplier.mobilePhone]
                                    .filter(Boolean)
                                    .map((phone) => (
                                        <div key={phone}>{phone}</div>
                                    ))}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

export function SuppliersTableFallback(): React.ReactElement {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header}>{header}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>

            <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={index}>
                        {headers.map((header) => (
                            <TableCell key={header}>
                                <Skeleton className="h-4 w-[100px]" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
