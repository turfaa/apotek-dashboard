import { Session } from "next-auth";

export interface FetchAPIOptions {
  version?: string;
  session?: Session | null;
  forHRIS?: boolean;
}

export async function fetchAPI<T>(
  method: string,
  url: string,
  body: any = null,
  options?: object,
  fetchAPIOptions?: FetchAPIOptions
): Promise<T> {
  const baseUrl = getBaseUrl(fetchAPIOptions);

  const res: Response = await fetch(`${baseUrl}${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Email": fetchAPIOptions?.session?.user?.email ?? "",
    },
    body: body ? JSON.stringify(body) : null,
    ...options,
  });

  if (!res.ok) {
    throw new Error(
      `An error occurred while fetching the data: ${res.statusText} (${baseUrl}${url})`
    );
  }

  return await res.json();
}

function getBaseUrl(fetchAPIOptions?: FetchAPIOptions): string {
  const baseUrl = fetchAPIOptions?.forHRIS
    ? process.env.HRIS_PROXY_URL
    : process.env.VMEDIS_PROXY_URL;
  return baseUrl ? `${baseUrl}/${fetchAPIOptions?.version ?? "v1"}` : "/api";
}
