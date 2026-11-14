"use client"

import { Copy } from "lucide-react"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { LetterItemsTable } from "@/components/purchase-order-letter/fields"
import { usePurchaseOrderLetter } from "@/lib/api/hooks"
import { PurchaseOrderLetterSummary } from "@/lib/api/purchase-order-letter"
import { DownloadButton } from "./download-button"
import { formatCreatedAt } from "./search-params"

export interface DetailDialogProps {
    // The SP to show; the dialog is closed when undefined.
    summary?: PurchaseOrderLetterSummary
    onOpenChange: (open: boolean) => void
    onDuplicate: (summary: PurchaseOrderLetterSummary) => void
}

export function DetailDialog({
    summary,
    onOpenChange,
    onDuplicate,
}: DetailDialogProps): React.ReactElement {
    const { data: detail, error } = usePurchaseOrderLetter(summary?.id)

    return (
        <Dialog open={!!summary} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{summary?.number}</DialogTitle>
                    <DialogDescription>{summary?.templateName}</DialogDescription>
                </DialogHeader>

                {error && (
                    <Alert variant="destructive">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <AlertTitle>Terjadi Kesalahan</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}

                {!error && !detail && (
                    <div className="flex flex-col gap-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                )}

                {detail && (
                    <>
                        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground">Supplier</dt>
                                <dd className="mt-0.5 font-medium">
                                    {detail.supplier.name}
                                </dd>
                                <dd className="mt-0.5 text-muted-foreground">
                                    {[detail.supplier.address, detail.supplier.city]
                                        .filter((part) => part.trim())
                                        .join(", ") || "Alamat kosong"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">Dibuat</dt>
                                <dd className="mt-0.5 font-medium">
                                    {formatCreatedAt(detail.createdAt)}
                                </dd>
                                <dd className="mt-0.5 text-muted-foreground">
                                    oleh {detail.createdByEmployee.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Tanda tangan APJ
                                </dt>
                                <dd className="mt-0.5 font-medium">
                                    {detail.signer
                                        ? `Ya · apt. ${detail.signer.name}`
                                        : "Tidak"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground">
                                    Jumlah obat
                                </dt>
                                <dd className="mt-0.5 font-medium">
                                    {detail.items.length}
                                </dd>
                            </div>
                        </dl>

                        <div className="rounded-md border">
                            <LetterItemsTable items={detail.items} />
                        </div>
                    </>
                )}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Tutup
                    </Button>
                    {summary && (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onDuplicate(summary)}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Duplikat
                            </Button>
                            <DownloadButton
                                id={summary.id}
                                number={summary.number}
                                variant="default"
                            />
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
