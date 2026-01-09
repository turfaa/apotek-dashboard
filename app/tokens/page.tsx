import { Metadata } from "next"
import { Suspense } from "react"
import { Title, Subtitle } from "@/components/typography/v2"
import TokensTable, { TokensTableFallback } from "./table"
import { CreateTokenDialog } from "./create-token-dialog"

export const metadata: Metadata = {
    title: "Manajemen Token",
    description: "Kelola token akses API",
}

export default async function TokensPage(): Promise<React.ReactElement> {
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title>Manajemen Token</Title>
                    <Subtitle>Kelola token akses API di sini.</Subtitle>
                </div>
                <CreateTokenDialog />
            </div>

            <div className="rounded-md border">
                <Suspense fallback={<TokensTableFallback />}>
                    <TokensTable />
                </Suspense>
            </div>
        </main>
    )
}
