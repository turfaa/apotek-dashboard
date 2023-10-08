export interface NavigationHook {
    homepage: string
    pages: Page[]
}

export interface Page {
    name: string
    href: string
}

const pages: Page[] = [
    {name: "Ringkasan", href: "/statistics"},
    {name: "Daftar Harga", href: "/price-list"},
    {name: "Pesanan", href: "/procurement"},
    {name: "Obat Terjual", href: "/sold-drugs"},
    {name: "Obat Harus Stok Opname", href: "/drugs-to-stock-opname"},
    {name: "Laporan Stok Opname", href: "/stock-opnames"},
]

export function useNavigation(): NavigationHook {
    return {
        homepage: pages[0].href.substring(1),
        pages: pages,
    }
}