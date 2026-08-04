"use client"

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Subtitle } from "@/components/typography"
import { Suspense, useState, useMemo } from "react"
import { Session } from "next-auth"
import { getLastDrugSales } from "@/lib/api/last-drug-sales"
import { TablePromise } from "@/cui/components/table"
import Link from "next/link"
import Loading from "@/components/loading"

const DEFAULT_DRUG_SALES_LIMIT = 5

interface LastSalesDialogProps {
    drugCode: string
    session: Session | null
}

export default function LastSalesDialog({
    drugCode,
    session,
}: LastSalesDialogProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false)
    const salesPromise = useMemo(() => {
        if (!isOpen) return Promise.resolve({ header: [], rows: [] })
        return getLastDrugSales(drugCode, DEFAULT_DRUG_SALES_LIMIT, session)
    }, [drugCode, session, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="self-start p-0">
                    <Subtitle className="cursor-pointer hover:underline">
                        Lihat harga penjualan obat terakhir
                    </Subtitle>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Penjualan Obat Terakhir</DialogTitle>
                </DialogHeader>
                <div className="rounded-md border">
                    <Suspense fallback={<Loading />}>
                        <TablePromise tablePromise={salesPromise} />
                    </Suspense>
                </div>
                <DialogFooter>
                    <Link
                        href={`/sales/by-drug?drug-code=${drugCode}`}
                        target="_blank"
                    >
                        <Subtitle className="cursor-pointer hover:underline">
                            Lihat lebih banyak
                        </Subtitle>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
