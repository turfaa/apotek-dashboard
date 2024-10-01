import { UserInfo, Role } from "./auth"
import { Session } from "next-auth"

export interface FetchAPIOptions {
    version?: string
    session?: Session | null
}

export async function fetchAPI<T>(
    method: string,
    url: string,
    body: any = null,
    options?: object,
    fetchAPIOptions?: FetchAPIOptions,
): Promise<T> {
    const baseUrl =
        process.env.VMEDIS_PROXY_URL
            ? `${process.env.VMEDIS_PROXY_URL}/${fetchAPIOptions?.version ?? "v1"}`
            : "/api"

    const res: Response = await fetch(`${baseUrl}${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            "X-Email": fetchAPIOptions?.session?.user?.email ?? "",
        },
        body: body ? JSON.stringify(body) : null,
        ...options,
    })

    if (!res.ok) {
        throw new Error(`An error occurred while fetching the data: ${res.statusText} (${baseUrl}${url})`)
    }

    return await res.json()
}
