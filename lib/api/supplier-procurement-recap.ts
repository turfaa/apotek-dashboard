import { Table } from "@/cui/types"
import { fetchAPI } from "./base"
import { buildDateRangeQueryParams } from "./common"
import { Session } from "next-auth"

export async function getSupplierProcurementRecaps(
    from?: string,
    until?: string,
    session?: Session | null,
): Promise<Table> {
    return fetchAPI(
        "GET",
        `/procurements/suppliers/recap?${buildDateRangeQueryParams(from, until)}`,
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            version: "v2",
            session: session,
        },
    )
}
