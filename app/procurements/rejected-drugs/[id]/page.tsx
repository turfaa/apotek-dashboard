import { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { Title, Subtitle } from "@/components/typography/v2"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table as TableComp,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Table } from "@/cui/components"
import { auth } from "@/lib/auth"
import { getRejectedDrug } from "@/lib/api/rejected-drug"
import { ArrowLeft } from "lucide-react"
import { EditRejectedDrugDialog } from "../edit-rejected-drug-dialog"
import { DeleteRejectedDrugButton } from "../delete-rejected-drug-button"

export const metadata: Metadata = {
    title: "Detail Obat Tertolak",
}

export interface RejectedDrugDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function RejectedDrugDetailPage(
    props: RejectedDrugDetailPageProps,
): Promise<React.ReactElement> {
    const { id } = await props.params

    return (
        <main className="p-4 md:p-10 mx-auto max-w-3xl">
            <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex items-start gap-2">
                    <Link href="/procurements/rejected-drugs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <Title>Detail Obat Tertolak</Title>
                        <Subtitle>
                            Rincian catatan obat tertolak beserta resolusinya.
                        </Subtitle>
                    </div>
                </div>
                <div className="flex gap-1">
                    <EditRejectedDrugDialog rejectedDrugId={id} />
                    <DeleteRejectedDrugButton
                        rejectedDrugId={id}
                        redirectTo="/procurements/rejected-drugs"
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Suspense fallback={<RejectedDrugDetailFallback />}>
                    <RejectedDrugDetail id={id} />
                </Suspense>
            </div>
        </main>
    )
}

async function RejectedDrugDetail({
    id,
}: {
    id: string
}): Promise<React.ReactElement> {
    const session = await auth()
    const data = await getRejectedDrug(Number(id), session)

    return <Table table={data} />
}

function RejectedDrugDetailFallback(): React.ReactElement {
    return (
        <TableComp>
            <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </TableComp>
    )
}
