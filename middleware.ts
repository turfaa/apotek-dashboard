import { NextResponse } from "next/server"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { isPageAllowed } from "@/lib/navigation"
import { Role } from "@/lib/api/auth"

export default withAuth(
    async function middleware(
        request: NextRequestWithAuth,
    ): Promise<NextResponse> {
        const { pathname, search } = request.nextUrl
        const { token } = request.nextauth

        if (pathname.includes("/api") && !pathname.includes("/api/auth")) {
            const path = pathname.replace("/api", "")
            const url = `${process.env.VMEDIS_PROXY_URL}${path}${search}`
            return NextResponse.rewrite(url)
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
