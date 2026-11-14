// Fails if any page under app/ has no rule in the page access table
// (lib/access.ts). Pages without a rule are denied at runtime anyway; this
// makes the omission visible before it ships.
//
// Usage: npm run check:access

import { readdirSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { findPageRule } from "../lib/access"

const APP_DIR = join(import.meta.dirname, "..", "app")

function findPages(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name)
        if (entry.isDirectory()) {
            return findPages(path)
        }

        return /^page\.(tsx|ts|jsx|js|mdx)$/.test(entry.name) ? [path] : []
    })
}

// Turns app/salary/snapshots/[id]/page.tsx into /salary/snapshots/[id].
function routeOf(pageFile: string): string {
    const segments = relative(APP_DIR, pageFile)
        .split(sep)
        .slice(0, -1)
        // Route groups and parallel route slots don't appear in the URL.
        .filter((s) => !/^\(.*\)$/.test(s) && !s.startsWith("@"))

    return `/${segments.join("/")}`
}

// A concrete path that a rule must match for the route to count as covered.
// A dynamic segment becomes a placeholder, so only "*" or "**" can match it;
// catch-all segments get two placeholders, so only "**" can match them.
function samplePathOf(route: string): string {
    return route
        .split("/")
        .map((segment) => {
            if (/^\[\[?\.\.\./.test(segment)) {
                return "__catch_all__/__catch_all__"
            }

            return /^\[.*\]$/.test(segment) ? "__dynamic__" : segment
        })
        .join("/")
}

const routes = findPages(APP_DIR).map(routeOf).sort()
const uncovered = routes.filter((route) => !findPageRule(samplePathOf(route)))

// proxy.ts lets root-level paths with a file extension (/favicon.ico,
// /manifest.json, ...) through without a page check. That is only safe
// while no page can be reached through a dynamic segment at the root.
const rootDynamic = routes.filter((route) => /^\/\[/.test(route))

let failed = false

if (uncovered.length > 0) {
    failed = true
    console.error("Pages with no access rule in lib/access.ts (pageRules):")
    for (const route of uncovered) {
        console.error(`  ${route}`)
    }
}

if (rootDynamic.length > 0) {
    failed = true
    console.error(
        "Pages with a dynamic segment at the root (unsafe with proxy.ts' static file bypass):",
    )
    for (const route of rootDynamic) {
        console.error(`  ${route}`)
    }
}

if (failed) {
    process.exit(1)
}

console.log(`All ${routes.length} pages have an access rule.`)
