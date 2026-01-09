import { fetchAPI } from "@/lib/api/base";
import { Table } from "@/cui/types";
import { Session } from "next-auth";

export async function getTokens(session?: Session | null): Promise<Table> {
  return fetchAPI<Table>(
    "GET",
    "/vmedis/tokens",
    null,
    {
      next: {
        revalidate: 0, // Don't cache, always revalidate.
      },
    },
    {
      session: session,
      version: "v2",
    },
  );
}

export async function createToken(
  token: string,
  session?: Session | null,
): Promise<void> {
  await fetchAPI(
    "POST",
    "/vmedis/tokens",
    { Token: token },
    {},
    {
      session: session,
      version: "v2",
    },
  );
}

export async function deleteToken(
  id: number,
  session?: Session | null,
): Promise<void> {
  await fetchAPI(
    "DELETE",
    `/vmedis/tokens/${id}`,
    null,
    {},
    {
      session: session,
      version: "v2",
    },
  );
}
