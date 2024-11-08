import NewDrugButton from "@/app/procurements/purchase-order/new-drug-button"
import RefreshButton from "@/app/procurements/purchase-order/refresh-button"
import PurchaseOrderTable from "@/app/procurements/purchase-order/table"
import PurchaseOrderTitle from "@/app/procurements/purchase-order/title"
import SearchButton from "@/components/search-button"
import moment from "moment/moment"
import { Metadata } from "next"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface PurchaseOrderProps {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}

export async function generateMetadata(
    props: PurchaseOrderProps,
): Promise<Metadata> {
    const { query, print } = (await props.searchParams)

    let title
    if (print === "true") {
        title = {
            absolute: `${moment().format("YYYY-MM-DD")}${query ? ` - ${query}` : ""}`,
        }
    } else {
        title = "Daftar Pesanan"
    }

    return {
        title: title,
        description: "Daftar pesanan obat",
    }
}

export default function PurchaseOrder() {
    return (
        <main className="p-4 md:p-10 mx-auto">
            <div className="flex pb-4">
                <Suspense>
                    <PurchaseOrderTitle />
                </Suspense>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Suspense>
                    <SearchButton />
                </Suspense>

                <div className="justify-self-end flex gap-4">
                    <Suspense>
                        <NewDrugButton />
                        <RefreshButton />
                    </Suspense>
                </div>
            </div>

            <Card className="mt-4">
                <CardContent className="mt-2">
                    <Suspense>
                        <PurchaseOrderTable />
                    </Suspense>
                </CardContent>
            </Card>
        </main>
    )
}
