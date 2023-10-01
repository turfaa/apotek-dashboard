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
    {name: "Pesanan", href: "/procurement"},
    {name: "Obat Terjual", href: "/sold-drugs"},
    {name: "Obat Harus Stok Opname", href: "/drugs-to-stock-opname"},
]

export function useNavigation(): NavigationHook {
    return {
        homepage: pages[0].href.substring(1),
        pages: pages,
    }
}