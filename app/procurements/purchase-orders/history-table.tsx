"use client"

import { useState, useTransition } from "react"
import { parseAsInteger, useQueryState } from "nuqs"
import { Copy, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterSigner,
    PurchaseOrderLetterSummary,
    PurchaseOrderLettersResponse,
} from "@/lib/api/purchase-order-letter"
import { DetailDialog } from "./detail-dialog"
import { DownloadButton } from "./download-button"
import { DuplicateDialog } from "./duplicate-dialog"
import { useResetFilters } from "./reset-filters"
import { filterKeys, formatCreatedAt } from "./search-params"

export interface HistoryTableClientProps {
    data: PurchaseOrderLettersResponse
    signer?: PurchaseOrderLetterSigner
    // Null when HRIS could not be read.
    employees: PurchaseOrderLetterEmployee[] | null
}

export function HistoryTableClient({
    data,
    signer,
    employees,
}: HistoryTableClientProps): React.ReactElement {
    const [detailOf, setDetailOf] = useState<PurchaseOrderLetterSummary>()
    const [duplicateOf, setDuplicateOf] = useState<PurchaseOrderLetterSummary>()

    const { purchaseOrders, total, page, pageSize } = data

    if (purchaseOrders.length === 0) {
        return <EmptyState pageBeyondEnd={total > 0 && page > 1} />
    }

    return (
        <>
            <div className="overflow-x-auto rounded-md border">
                <Table className="min-w-[1000px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nomor SP</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Template</TableHead>
                            <TableHead className="text-right">
                                Jumlah Obat
                            </TableHead>
                            <TableHead>TTD APJ</TableHead>
                            <TableHead>Dibuat oleh</TableHead>
                            <TableHead>
                                <span className="sr-only">Aksi</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchaseOrders.map((po) => (
                            <TableRow key={po.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {po.number}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {formatCreatedAt(po.createdAt)}
                                </TableCell>
                                <TableCell>{po.supplier.name}</TableCell>
                                <TableCell>{po.templateName}</TableCell>
                                <TableCell className="text-right">
                                    {po.itemCount}
                                </TableCell>
                                <TableCell>
                                    <SignatureBadge
                                        signed={po.includePharmacistSignature}
                                    />
                                </TableCell>
                                <TableCell>{po.createdByEmployee.name}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDetailOf(po)}
                                        >
                                            Detail
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDuplicateOf(po)}
                                        >
                                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                                            Duplikat
                                        </Button>
                                        <DownloadButton
                                            id={po.id}
                                            number={po.number}
                                            size="sm"
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination page={page} pageSize={pageSize} total={total} shown={purchaseOrders.length} />

            <DetailDialog
                summary={detailOf}
                onOpenChange={(open) => !open && setDetailOf(undefined)}
                onDuplicate={(po) => {
                    setDetailOf(undefined)
                    setDuplicateOf(po)
                }}
            />

            <DuplicateDialog
                summary={duplicateOf}
                onOpenChange={(open) => !open && setDuplicateOf(undefined)}
                signer={signer}
                employees={employees}
            />
        </>
    )
}

export function SignatureBadge({ signed }: { signed: boolean }): React.ReactElement {
    return signed ? <Badge>Ya</Badge> : <Badge variant="outline">Tidak</Badge>
}

interface PaginationProps {
    page: number
    pageSize: number
    total: number
    shown: number
}

function Pagination({ page, pageSize, total, shown }: PaginationProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const [, setPage] = useQueryState(
        filterKeys.page,
        parseAsInteger.withOptions({ shallow: false, startTransition }),
    )

    const first = (page - 1) * pageSize + 1
    const last = first + shown - 1

    return (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
                Menampilkan {first}–{last} dari {total} surat pesanan
            </span>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isPending}
                    onClick={() => setPage(page - 1 > 1 ? page - 1 : null)}
                >
                    Sebelumnya
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={last >= total || isPending}
                    onClick={() => setPage(page + 1)}
                >
                    Berikutnya
                </Button>
            </div>
        </div>
    )
}

function EmptyState({ pageBeyondEnd }: { pageBeyondEnd: boolean }): React.ReactElement {
    const [resetFilters, isResetting] = useResetFilters()
    const [isPending, startTransition] = useTransition()
    const [, setPage] = useQueryState(
        filterKeys.page,
        parseAsInteger.withOptions({ shallow: false, startTransition }),
    )

    return (
        <div className="flex flex-col items-center gap-2 rounded-md border px-6 py-12 text-center">
            <FileText className="h-7 w-7 text-muted-foreground" aria-hidden />
            <p className="font-medium">Tidak ada surat pesanan</p>
            {pageBeyondEnd ? (
                <>
                    <p className="text-sm text-muted-foreground">
                        Halaman ini kosong.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isPending}
                        onClick={() => setPage(null)}
                    >
                        Ke halaman pertama
                    </Button>
                </>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground">
                        Tidak ada surat pesanan yang cocok dengan filter ini.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isResetting}
                        onClick={resetFilters}
                    >
                        Reset filter
                    </Button>
                </>
            )}
        </div>
    )
}
