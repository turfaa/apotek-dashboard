import { Role } from "@/lib/api/auth"
import { auth } from "@/lib/auth"
import { Session } from "next-auth"
import { redirect } from "next/navigation"

// Defence in depth for server components that fetch sensitive data: proxy.ts
// already denies these pages, but if its matcher ever misses one, this stops
// the page before it fetches anything. Call it before any fetch, and outside
// any try/catch (redirect() works by throwing).
export async function requireRole(roles: Role[]): Promise<Session | null> {
    const session = await auth()
    if (!roles.includes(session?.user?.role ?? Role.GUEST)) {
        redirect("/")
    }

    return session
}
