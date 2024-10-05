import { Table } from "@/cui/types"
import { fetchAPI } from "./base"
import { Session } from "next-auth"

export async function getLastDrugProcurements(
    drugCode: string,
    limit: number = 5,
    session?: Session | null,
): Promise<Table> {
    return fetchAPI(
        "GET",
        `/procurements/drugs/${drugCode}/last?limit=${limit}`,
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
            cache: "no-cache",
        },
        {
            version: "v2",
            session: session,
        },
    )
}
