import { Role } from "@/lib/api/auth"
import { auth } from "@/lib/auth"
import { isPageAllowed } from "@/lib/navigation"
import { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"

interface RewriteRule {
    source: string
    destination: string
    allowedRoles: Role[]
}

const rewrites = [
    {
        source: "/api/sales/statistics",
        destination: `${process.env.VMEDIS_PROXY_URL}/v1/sales/statistics`,
        allowedRoles: [Role.ADMIN],
    },
    {
        source: "/api/procurements/recommendations",
        destination: `${process.env.VMEDIS_PROXY_URL}/v1/procurements/recommendations`,
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },

    // v2 APIs are not protected by auth here becuase they are protected in the backend.
    {
        source: "/api/drugs",
        destination: `${process.env.VMEDIS_PROXY_URL}/v2/drugs`,
        allowedRoles: [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST],
    },
    {
        source: "/api/procurements/drugs",
        destination: `${process.env.VMEDIS_PROXY_URL}/v2/procurements/drugs`,
        allowedRoles: [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST],
    },
] satisfies RewriteRule[]

export default auth(async function middleware(
    request: NextAuthRequest,
): Promise<NextResponse> {
    const { pathname, search } = request.nextUrl
    const role = request.auth?.user?.role ?? Role.GUEST

    for (const rule of rewrites) {
        if (pathname.startsWith(rule.source)) {
            if (!rule.allowedRoles.includes(role)) {
                return NextResponse.json(
                    { message: "Unauthorized" },
                    { status: 401 },
                )
            }

            const restOfPath = pathname.replace(rule.source, "")

            const requestHeaders = new Headers(request.headers)
            requestHeaders.set("x-email", request.auth?.user?.email ?? "")

            const url = `${rule.destination}${restOfPath}${search}`
            return NextResponse.rewrite(url, {
                headers: requestHeaders,
            })
        }
    }

    const firstPathSegment = `/${pathname.split("/")[1]}`
    if (!isPageAllowed(firstPathSegment, role)) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        url.search = ""
        return NextResponse.redirect(url)
    }



    return NextResponse.next()
})
