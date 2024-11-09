import { Table } from "@/cui/types"
import { fetchAPI } from "./base"
import { Session } from "next-auth"
import { buildDateRangeQueryParams } from "./common"

export async function getShifts(
    from?: string,
    until?: string,
    session?: Session | null,
): Promise<Table> {
    return fetchAPI(
        "GET",
        `/shifts?${buildDateRangeQueryParams(from, until)}`,
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
