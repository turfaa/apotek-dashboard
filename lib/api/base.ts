const baseUrl: string = process.env.VMEDIS_PROXY_URL ?? "/api"

export async function fetchAPI<T>(
    method: string,
    url: string,
    body: any = null,
    options: object = {},
): Promise<T> {
    const res: Response = await fetch(`${baseUrl}${url}`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
        ...options,
    })

    if (!res.ok) {
        throw new Error("An error occurred while fetching the data.")
    }

    return await res.json()
}
