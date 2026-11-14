import {
    apiTargetPath,
    findApiRule,
    isApiMethodAllowed,
    isPageAllowed,
    type Backend,
} from "@/lib/access"
import { Role } from "@/lib/api/auth"
import { auth } from "@/lib/auth"
import { NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"

const backendUrls: Record<Backend, string | undefined> = {
    vmedis: process.env.VMEDIS_PROXY_URL,
    hris: process.env.HRIS_PROXY_URL,
}

// Files served from /public and app/icon.png live at the root, e.g.
// /favicon.ico, /manifest.json, /icon.png. No page sits at a root dynamic
// segment (checked by `npm run check:access`), so these can't be pages.
const ROOT_FILE = /^\/[^/]+\.[A-Za-z0-9]+$/

function isFrameworkPath(pathname: string): boolean {
    return (
        pathname.startsWith("/_next/") ||
        pathname === "/api/auth" ||
        pathname.startsWith("/api/auth/") ||
        ROOT_FILE.test(pathname)
    )
}

export default auth(async function middleware(
    request: NextAuthRequest,
): Promise<NextResponse> {
    const { pathname, search } = request.nextUrl
    const role = request.auth?.user?.role ?? Role.GUEST

    if (isFrameworkPath(pathname)) {
        return NextResponse.next()
    }

    if (pathname === "/api" || pathname.startsWith("/api/")) {
        const rule = findApiRule(pathname)
        if (!rule) {
            return NextResponse.json({ message: "Not Found" }, { status: 404 })
        }

        if (!isApiMethodAllowed(rule, request.method, role)) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 },
            )
        }

        const requestHeaders = new Headers(request.headers)
        requestHeaders.set("x-email", request.auth?.user?.email ?? "")

        const url = `${backendUrls[rule.backend]}${apiTargetPath(rule, pathname)}${search}`
        // `request.headers` replaces the headers sent upstream, so a client
        // can't pass its own X-Email through to the backends.
        return NextResponse.rewrite(url, {
            request: { headers: requestHeaders },
        })
    }

    if (!isPageAllowed(pathname, role)) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        url.search = ""
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
})

export const config = {
    // Skip static build output; everything else goes through the checks above.
    matcher: ["/((?!_next/static|_next/image).*)"],
}
