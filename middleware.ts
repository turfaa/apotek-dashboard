import { Role } from "@/lib/api/auth"
import { isPageAllowed } from "@/lib/navigation"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

interface RewriteRule {
    source: string
    destination: string
    allowedRoles: Role[]
}

const rewrites = [
    {
        source: "/api/drugs",
        destination: `${process.env.VMEDIS_PROXY_URL}/drugs`,
        allowedRoles: [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST],
    },
    {
        source: "/api/sales/statistics",
        destination: `${process.env.VMEDIS_PROXY_URL}/sales/statistics`,
        allowedRoles: [Role.ADMIN],
    },
    {
        source: "/api/procurements/recommendations",
        destination: `${process.env.VMEDIS_PROXY_URL}/procurements/recommendations`,
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
] satisfies RewriteRule[]

export default withAuth(
    async function middleware(
        request: NextRequestWithAuth,
    ): Promise<NextResponse> {
        const { pathname, search } = request.nextUrl
        const { token } = request.nextauth

        for (const rule of rewrites) {
            if (pathname.includes(rule.source)) {
                if (!rule.allowedRoles.includes(token?.role as Role)) {
                    return NextResponse.json(
                        { message: "Unauthorized" },
                        { status: 401 },
                    )
                }

                const url = `${rule.destination}${search}`
                return NextResponse.rewrite(url)
            }
        }

        const firstPathSegment = `/${pathname.split("/")[1]}`
        if (!isPageAllowed(firstPathSegment, token?.role as Role)) {
            const url = request.nextUrl.clone()
            url.pathname = "/"
            url.search = ""
            return NextResponse.redirect(url)
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized(): boolean {
                return true
            },
        },
    },
)
