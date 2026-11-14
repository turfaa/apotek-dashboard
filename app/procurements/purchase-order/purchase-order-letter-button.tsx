"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { PurchaseOrderLetterEmployee } from "@/lib/api/purchase-order-letter"
import { usePrintMode } from "@/lib/print-mode"
import { useHydrated } from "@/lib/use-hydrated"
import { PurchaseOrderLetterDialog } from "./purchase-order-letter-dialog"
import { useFilteredPurchaseOrders } from "./use-filtered-purchase-orders"

export interface PurchaseOrderLetterButtonProps {
    // Null when HRIS could not be read.
    employeesPromise: Promise<PurchaseOrderLetterEmployee[] | null>
}

export default function PurchaseOrderLetterButton({
    employeesPromise,
}: PurchaseOrderLetterButtonProps): React.ReactElement {
    const hydrated = useHydrated()
    const { isPrintMode } = usePrintMode()
    const { rows, query, isLoading } = useFilteredPurchaseOrders()
    const [open, setOpen] = useState(false)

    if (isPrintMode) {
        return <></>
    }

    const isEmpty = hydrated && !isLoading && rows.length === 0
    const disabled = !hydrated || isLoading || rows.length === 0

    const button = (
        <Button disabled={disabled} onClick={() => setOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Buat Surat Pesanan
        </Button>
    )

    return (
        <>
            {isEmpty ? (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {/* A disabled button gets no pointer events, so
                                the tooltip hangs on a focusable wrapper. */}
                            <span tabIndex={0} className="inline-flex">
                                {button}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            Tidak ada obat yang ditampilkan. Ubah pencarian
                            dulu.
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                button
            )}

            <PurchaseOrderLetterDialog
                open={open}
                onOpenChange={setOpen}
                rows={rows}
                query={query}
                employeesPromise={employeesPromise}
            />
        </>
    )
}
