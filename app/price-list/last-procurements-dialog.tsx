"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Subtitle } from "@/components/typography"
import { Suspense, useState, useMemo } from "react"
import { Session } from "next-auth"
import { getLastDrugProcurements } from "@/lib/api/last-drug-procurements"
import { TablePromise } from "@/cui/components/table"
import Link from "next/link"
import Loading from "@/components/loading"

const DEFAULT_DRUG_PROCUREMENTS_LIMIT = 5

interface LastProcurementsDialogProps {
    drugCode: string
    session: Session | null
}

export default function LastProcurementsDialog({ drugCode, session }: LastProcurementsDialogProps): React.ReactElement {
    const [isOpen, setIsOpen] = useState(false)
    const procurementsPromise = useMemo(() => {
        if (!isOpen) return Promise.resolve({ header: [], rows: [] })
        return getLastDrugProcurements(drugCode, DEFAULT_DRUG_PROCUREMENTS_LIMIT, session)
    }, [drugCode, session, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="self-start p-0">
                    <Subtitle className="cursor-pointer hover:underline">
                        Lihat harga pembelian obat terakhir
                    </Subtitle>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Pembelian Obat Terakhir</DialogTitle>
                </DialogHeader>
                <div className="rounded-md border">
                    <Suspense fallback={<Loading />}>
                        <TablePromise tablePromise={procurementsPromise} />
                    </Suspense>
                </div>
                <DialogFooter>
                    <Link href={`/procurements/by-drug?drug-code=${drugCode}`} target="_blank">
                        <Subtitle className="cursor-pointer hover:underline">
                            Lihat lebih banyak
                        </Subtitle>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 