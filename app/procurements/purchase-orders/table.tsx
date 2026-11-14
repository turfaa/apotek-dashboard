import { Session } from "next-auth"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
    PurchaseOrderLetterEmployee,
    PurchaseOrderLetterOptions,
    PurchaseOrderLettersResponse,
    listPurchaseOrderLetters,
} from "@/lib/api/purchase-order-letter"
import { SearchParams } from "@/types/search-params"
import { HistoryTableClient } from "./history-table"
import { filtersFromSearchParams } from "./search-params"

export interface HistoryTableProps {
    searchParams: SearchParams
    sessionPromise: Promise<Session | null>
    optionsPromise: Promise<PurchaseOrderLetterOptions | null>
    employeesPromise: Promise<PurchaseOrderLetterEmployee[] | null>
}

type ListResult =
    | { ok: true; data: PurchaseOrderLettersResponse }
    | { ok: false; message: string }

export default async function HistoryTable({
    searchParams,
    sessionPromise,
    optionsPromise,
    employeesPromise,
}: HistoryTableProps): Promise<React.ReactElement> {
    const [session, params, options, employees] = await Promise.all([
        sessionPromise,
        searchParams,
        optionsPromise,
        employeesPromise,
    ])

    const result: ListResult = await listPurchaseOrderLetters(
        filtersFromSearchParams(params),
        session,
    ).then(
        (data): ListResult => ({ ok: true, data }),
        (error: unknown): ListResult => ({
            ok: false,
            message: error instanceof Error ? error.message : String(error),
        }),
    )

    if (!result.ok) {
        return (
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Terjadi Kesalahan</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
            </Alert>
        )
    }

    return (
        <HistoryTableClient
            data={result.data}
            signer={options?.signer}
            employees={employees}
        />
    )
}

export function HistoryTableFallback(): React.ReactElement {
    return (
        <div className="flex flex-col gap-2 rounded-md border p-4">
            {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
            ))}
        </div>
    )
}
