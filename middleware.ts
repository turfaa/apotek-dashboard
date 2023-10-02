import {NextRequest, NextResponse} from "next/server"

export function middleware(request: NextRequest): NextResponse {
    const {pathname, search} = new URL(request.nextUrl)
    const path = pathname.replace("/api", "")
    const url = `${process.env.VMEDIS_PROXY_URL}${path}${search}`
    return NextResponse.rewrite(url)
}

export const config = {
    matcher: "/api/:path*", // Proxy all paths starting with /api.
}