import { Role } from "@/lib/api/auth"

// Access control for pages and API routes. Everything is deny-by-default:
// a page path or API path that matches no rule here is denied for every role.
//
// Patterns are matched by path segment:
// - a literal segment matches itself only ("/salary" does not match "/salary-x")
// - "*" matches exactly one segment
// - "**" (last segment only) matches the path so far and everything under it
//
// When several rules match, the most specific one wins (see `specificity`).

const ALL_ROLES = [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST]
const ADMIN = [Role.ADMIN]
const ADMIN_STAFF = [Role.ADMIN, Role.STAFF]

export interface PageRule {
    pattern: string
    roles: Role[]
}

export const pageRules: PageRule[] = [
    { pattern: "/", roles: ALL_ROLES },
    { pattern: "/price-list", roles: ALL_ROLES },

    { pattern: "/statistics", roles: ADMIN },

    { pattern: "/sold-drugs", roles: ADMIN_STAFF },
    { pattern: "/sales/**", roles: ADMIN_STAFF },

    { pattern: "/procurements/**", roles: ADMIN_STAFF },
    { pattern: "/stock-opnames/**", roles: ADMIN_STAFF },
    { pattern: "/shifts", roles: ADMIN_STAFF },
    { pattern: "/vmedis/tokens", roles: ADMIN_STAFF },

    { pattern: "/works/logs", roles: ADMIN_STAFF },
    { pattern: "/works/types/**", roles: ADMIN },

    { pattern: "/attendances", roles: ADMIN_STAFF },
    { pattern: "/attendances/types/**", roles: ADMIN },
    { pattern: "/attendances/quotas/**", roles: ADMIN },

    { pattern: "/salary/**", roles: ADMIN },
    { pattern: "/employees/**", roles: ADMIN },
]

export type Backend = "vmedis" | "hris"

export interface ApiRule {
    // Path prefix under the dashboard; matches the prefix and everything under it.
    source: string
    backend: Backend
    // Path on the backend that `source` is rewritten to, e.g. "/v1/employees".
    target: string
    // Roles allowed to send GET / HEAD.
    read: Role[]
    // Roles allowed to send any other method (POST, PUT, PATCH, DELETE, ...).
    write: Role[]
}

export const apiRules: ApiRule[] = [
    // Vmedis v1
    {
        source: "/api/sales/statistics",
        backend: "vmedis",
        target: "/v1/sales/statistics",
        read: ADMIN,
        write: ADMIN,
    },
    {
        source: "/api/procurements/recommendations",
        backend: "vmedis",
        target: "/v1/procurements/recommendations",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/suppliers",
        backend: "vmedis",
        target: "/v1/suppliers",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },

    // Vmedis v2: these endpoints also check roles in the backend.
    {
        source: "/api/drugs",
        backend: "vmedis",
        target: "/v2/drugs",
        read: ALL_ROLES,
        write: ALL_ROLES,
    },
    {
        source: "/api/procurements/drugs",
        backend: "vmedis",
        target: "/v2/procurements/drugs",
        read: ALL_ROLES,
        write: ALL_ROLES,
    },
    {
        // Last sales per drug: /api/sales/drugs/{code}/last. The v1 sold drugs
        // report (/sales/drugs) is fetched on the server only.
        source: "/api/sales/drugs",
        backend: "vmedis",
        target: "/v2/sales/drugs",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/procurements/suppliers",
        backend: "vmedis",
        target: "/v2/procurements/suppliers",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/shifts",
        backend: "vmedis",
        target: "/v2/shifts",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/tokens",
        backend: "vmedis",
        target: "/v2/vmedis/tokens",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/rejected-drugs",
        backend: "vmedis",
        target: "/v2/rejected-drugs",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },

    // HRIS v1: HRIS has no auth of its own, so these rules are its only guard.
    {
        source: "/api/employees",
        backend: "hris",
        target: "/v1/employees",
        read: ADMIN_STAFF,
        write: ADMIN,
    },
    {
        source: "/api/work-types",
        backend: "hris",
        target: "/v1/work-types",
        read: ADMIN_STAFF,
        write: ADMIN,
    },
    {
        source: "/api/work-logs",
        backend: "hris",
        target: "/v1/work-logs",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/attendances/types",
        backend: "hris",
        target: "/v1/attendances/types",
        read: ADMIN_STAFF,
        write: ADMIN,
    },
    {
        source: "/api/attendances/quotas",
        backend: "hris",
        target: "/v1/attendances/quotas",
        read: ADMIN_STAFF,
        write: ADMIN,
    },
    {
        // Attendance entries: PUT /api/attendances/{employee}/{date}.
        source: "/api/attendances",
        backend: "hris",
        target: "/v1/attendances",
        read: ADMIN_STAFF,
        write: ADMIN_STAFF,
    },
    {
        source: "/api/salary",
        backend: "hris",
        target: "/v1/salary",
        read: ADMIN,
        write: ADMIN,
    },
]

export function splitPath(path: string): string[] {
    return path.split("/").filter((segment) => segment.length > 0)
}

export function matchesPattern(pattern: string, path: string): boolean {
    const patternSegments = splitPath(pattern)
    const pathSegments = splitPath(path)

    for (let i = 0; i < patternSegments.length; i++) {
        const segment = patternSegments[i]

        if (segment === "**") {
            return i === patternSegments.length - 1
        }

        if (i >= pathSegments.length) {
            return false
        }

        if (segment !== "*" && segment !== pathSegments[i]) {
            return false
        }
    }

    return patternSegments.length === pathSegments.length
}

// Higher is more specific: more literal segments first, then fewer "*",
// then an exact pattern over one ending in "**".
function specificity(pattern: string): number {
    const segments = splitPath(pattern)
    const literals = segments.filter((s) => s !== "*" && s !== "**").length
    const singles = segments.filter((s) => s === "*").length
    const isExact = segments.at(-1) !== "**"

    return literals * 1000 - singles * 10 + (isExact ? 1 : 0)
}

function mostSpecific<T>(
    candidates: T[],
    patternOf: (candidate: T) => string,
): T | undefined {
    let best: T | undefined
    let bestScore = -Infinity

    for (const candidate of candidates) {
        const score = specificity(patternOf(candidate))
        if (score > bestScore) {
            best = candidate
            bestScore = score
        }
    }

    return best
}

export function findPageRule(path: string): PageRule | undefined {
    return mostSpecific(
        pageRules.filter((rule) => matchesPattern(rule.pattern, path)),
        (rule) => rule.pattern,
    )
}

export function isPageAllowed(path: string, role?: Role | null): boolean {
    const rule = findPageRule(path)
    return rule?.roles.includes(role ?? Role.GUEST) ?? false
}

export function findApiRule(path: string): ApiRule | undefined {
    return mostSpecific(
        apiRules.filter(
            (rule) =>
                path === rule.source || path.startsWith(`${rule.source}/`),
        ),
        (rule) => rule.source,
    )
}

export function isReadMethod(method: string): boolean {
    const upper = method.toUpperCase()
    return upper === "GET" || upper === "HEAD"
}

export function isApiMethodAllowed(
    rule: ApiRule,
    method: string,
    role?: Role | null,
): boolean {
    const roles = isReadMethod(method) ? rule.read : rule.write
    return roles.includes(role ?? Role.GUEST)
}

export function isApiAllowed(
    path: string,
    method: string,
    role?: Role | null,
): boolean {
    const rule = findApiRule(path)
    return rule ? isApiMethodAllowed(rule, method, role) : false
}

// Path on the backend for a request matched by `rule`, without the backend
// base URL. The rest of the path (including a trailing slash) is kept as is.
export function apiTargetPath(rule: ApiRule, path: string): string {
    return `${rule.target}${path.slice(rule.source.length)}`
}
