import { fetchAPI } from "@/lib/api/base"
import { Table } from "@/cui/types"
import { Session } from "next-auth"

export async function getTokens(session?: Session | null): Promise<Table> {
    return fetchAPI<Table>(
        "GET",
        "/tokens",
        null,
        {
            next: {
                revalidate: 0, // Don't cache, always revalidate.
            },
        },
        {
            session: session,
        },
    )
}

export async function createToken(
    token: string,
    session?: Session | null,
): Promise<void> {
    await fetchAPI(
        "POST",
        "/tokens",
        { Token: token },
        {},
        {
            session: session,
        },
    )
}

export async function deleteToken(
    id: number,
    session?: Session | null,
): Promise<void> {
    await fetchAPI(
        "DELETE",
        `/tokens/${id}`,
        null,
        {},
        {
            session: session,
        },
    )
}
