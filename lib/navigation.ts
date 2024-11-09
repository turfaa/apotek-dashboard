import { Role } from "@/lib/api/auth"

export interface NavigationHook {
    homepage: string
    navigations: NavigationItem[]
}

export interface NavigationItem {
    name: string
    target: string | Page[]
    allowedRoles?: Role[]
}

export interface Page {
    name: string
    href: string
    allowedRoles?: Role[]
}

const availableNavigations: NavigationItem[] = [
    {
        name: "Ringkasan",
        target: "/statistics",
        allowedRoles: [Role.ADMIN],
    },
    {
        name: "Penjualan",
        target: [
            {
                name: "Daftar Harga",
                href: "/price-list",
                allowedRoles: [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST],
            },
            {
                name: "Obat Terjual",
                href: "/sold-drugs",
                allowedRoles: [Role.ADMIN, Role.STAFF],
            },
        ],
        allowedRoles: [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST],
    },
    {
        name: "Pembelian",
        target: [
            {
                name: "Buat Pesanan",
                href: "/procurements/purchase-order",
                allowedRoles: [Role.ADMIN, Role.STAFF],
            },
            {
                name: "Harga Obat Terakhir",
                href: "/procurements/by-drug",
                allowedRoles: [Role.ADMIN],
            },
            {
                name: "Kalkulator Faktur",
                href: "/procurements/invoice-calculator",
                allowedRoles: [Role.ADMIN, Role.STAFF],
            },
        ],
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
    {
        name: "Stock Opname",
        target: [
            {
                name: "Obat Harus SO",
                href: "/stock-opnames/drugs-to-stock-opname",
                allowedRoles: [Role.ADMIN, Role.STAFF],
            },
            {
                name: "Laporan SO",
                href: "/stock-opnames",
                allowedRoles: [Role.ADMIN, Role.STAFF],
            },
        ],
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
    {
        name: "Laporan Shift",
        target: "/shifts",
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
]

export function useNavigation(role?: Role | null): NavigationHook {
    const navigations = allowedNavigations(role)

    return {
        homepage: homepage(navigations),
        navigations: flattenSingleNavigations(navigations),
    }
}

export function homepage(items: NavigationItem[]): string {
    if (typeof items[0].target === "string") {
        return items[0].target.substring(1)
    }

    return items[0].target[0].href.substring(1)
}

export function allowedNavigations(role?: Role | null): NavigationItem[] {
    if (!role) {
        role = Role.GUEST
    }

    const navigations = availableNavigations
        .filter((navigation) => !navigation.allowedRoles || navigation.allowedRoles.includes(role))
        .map((navigation) => ({
            ...navigation,
            target: typeof navigation.target === "string" ? navigation.target : navigation.target.filter((page) => !page.allowedRoles || page.allowedRoles.includes(role)),
        }))
        .filter((navigation) => navigation.target.length > 0)

    return flattenSingleNavigations(navigations)
}

export function isPageAllowed(href: string, role?: Role | null): boolean {
    const matchedNavigations = availableNavigations.filter((navigation) => navigation.target === href)

    const matchedPages = availableNavigations
        .flatMap((navigation) => Array.isArray(navigation.target) ? navigation.target : [])
        .filter((page) => page.href === href)

    if (matchedNavigations.length === 0 && matchedPages.length === 0) {
        return true
    }

    return (
        matchedNavigations.some((navigation) => !navigation.allowedRoles || navigation.allowedRoles.includes(role ?? Role.GUEST)) ||
        matchedPages.some((page) => !page.allowedRoles || page.allowedRoles.includes(role ?? Role.GUEST))
    )
}

function flattenSingleNavigations(navigations: NavigationItem[]): NavigationItem[] {
    return navigations.map((navigation) => {
        if (typeof navigation.target === "string") {
            return navigation
        }

        if (navigation.target.length > 1) {
            return navigation
        }

        const page = navigation.target[0]
        return {
            name: page.name,
            target: page.href,
            allowedRoles: page.allowedRoles,
        }
    })
}
