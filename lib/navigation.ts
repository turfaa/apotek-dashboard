import { Role } from "@/lib/api/auth"

export interface NavigationHook {
    homepage: string
    pages: Page[]
}

export interface Page {
    name: string
    href: string
    allowedRoles?: Role[]
}

const availablePages: Page[] = [
    {
        name: "Ringkasan",
        href: "/statistics",
        allowedRoles: [Role.ADMIN],
    },
    {
        name: "Daftar Harga",
        href: "/price-list",
        allowedRoles: [Role.ADMIN, Role.STAFF, Role.RESELLER, Role.GUEST],
    },
    {
        name: "Pesanan",
        href: "/procurements/purchase-order",
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
    {
        name: "Harga Obat Terakhir",
        href: "/procurements/by-drug",
        allowedRoles: [Role.ADMIN],
    },
    {
        name: "Obat Terjual",
        href: "/sold-drugs",
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
    {
        name: "Obat Harus SO",
        href: "/stock-opnames/drugs-to-stock-opname",
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
    {
        name: "Laporan SO",
        href: "/stock-opnames",
        allowedRoles: [Role.ADMIN],
    },
    {
        name: "Kalkulator Faktur",
        href: "/procurements/invoice-calculator",
        allowedRoles: [Role.ADMIN, Role.STAFF],
    },
]

export function useNavigation(role?: Role | null): NavigationHook {
    const pages = allowedPages(role)

    return {
        homepage: homepage(pages),
        pages: pages,
    }
}

export function homepage(pages: Page[]): string {
    return pages[0].href.substring(1)
}

export function allowedPages(role?: Role | null): Page[] {
    return availablePages.filter((page) => {
        if (!page.allowedRoles) {
            return true
        }

        if (!role) {
            role = Role.GUEST
        }

        return page.allowedRoles.includes(role)
    })
}

export function isPageAllowed(href: string, role?: Role | null): boolean {
    const page = availablePages.find((page) => page.href === href)
    if (!page || !page.allowedRoles) {
        return true
    }

    return page.allowedRoles.includes(role ?? Role.GUEST)
}
