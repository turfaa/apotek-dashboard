import { isPageAllowed } from "@/lib/access"
import { Role } from "@/lib/api/auth"

export interface NavigationHook {
    homepage: string
    navigations: NavigationItem[]
}

// Which roles see a menu item comes from the page access table in
// lib/access.ts: a page is listed only if the role may open it, and a group
// only if at least one of its pages is listed.
export interface NavigationItem {
    name: string
    target: string | Page[]
}

export interface Page {
    name: string
    href: string
}

const availableNavigations: NavigationItem[] = [
    {
        name: "Ringkasan",
        target: "/statistics",
    },
    {
        name: "Penjualan",
        target: [
            {
                name: "Daftar Harga",
                href: "/price-list",
            },
            {
                name: "Obat Terjual",
                href: "/sold-drugs",
            },
            {
                name: "Harga Jual Obat Terakhir",
                href: "/sales/by-drug",
            },
        ],
    },
    {
        name: "Pembelian",
        target: [
            {
                name: "Buat Pesanan",
                href: "/procurements/purchase-order",
            },
            {
                name: "Riwayat Surat Pesanan",
                href: "/procurements/purchase-orders",
            },
            {
                name: "Harga Obat Terakhir",
                href: "/procurements/by-drug",
            },
            {
                name: "Rekap Pembelian per Supplier",
                href: "/procurements/by-supplier",
            },
            {
                name: "Kalkulator Faktur",
                href: "/procurements/invoice-calculator",
            },
            {
                name: "Obat Tertolak",
                href: "/procurements/rejected-drugs",
            },
            {
                name: "Daftar Supplier",
                href: "/procurements/suppliers",
            },
        ],
    },
    {
        name: "Stock Opname",
        target: [
            {
                name: "Obat Harus Stok Opname",
                href: "/stock-opnames/drugs-to-stock-opname",
            },
            {
                name: "Laporan Stok Opname",
                href: "/stock-opnames",
            },
        ],
    },
    {
        name: "Laporan Shift",
        target: "/shifts",
    },
    {
        name: "Pekerjaan",
        target: [
            {
                name: "Laporan Pekerjaan",
                href: "/works/logs",
            },
            {
                name: "Jenis Pekerjaan",
                href: "/works/types",
            },
        ],
    },
    {
        name: "Gaji",
        target: [
            {
                name: "Kalkulator Gaji",
                href: "/salary/calculator",
            },
            {
                name: "Komponen Gaji Statis",
                href: "/salary/static-components",
            },
            {
                name: "Komponen Gaji Tambahan",
                href: "/salary/additional-components",
            },
            {
                name: "Informasi Tambahan",
                href: "/salary/extra-infos",
            },
            {
                name: "Snapshot Gaji",
                href: "/salary/snapshots",
            },
        ],
    },
    {
        name: "HRIS",
        target: [
            {
                name: "Karyawan",
                href: "/employees",
            },
            {
                name: "Kehadiran",
                href: "/attendances",
            },
            {
                name: "Jenis Kehadiran",
                href: "/attendances/types",
            },
            {
                name: "Kuota Kehadiran",
                href: "/attendances/quotas",
            },
        ],
    },
    {
        name: "Vmedis",
        target: [
            {
                name: "Manajemen Token",
                href: "/vmedis/tokens",
            },
        ],
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
    const navigations = availableNavigations
        .map((navigation) => ({
            ...navigation,
            target:
                typeof navigation.target === "string"
                    ? navigation.target
                    : navigation.target.filter((page) =>
                        isPageAllowed(page.href, role),
                    ),
        }))
        .filter((navigation) =>
            typeof navigation.target === "string"
                ? isPageAllowed(navigation.target, role)
                : navigation.target.length > 0,
        )

    return flattenSingleNavigations(navigations)
}

function flattenSingleNavigations(
    navigations: NavigationItem[],
): NavigationItem[] {
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
        }
    })
}
