"use client"

import { usePrintMode } from "@/lib/print-mode"
import { BookOpenIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import { Tab, TabList } from "@tremor/react"

// DrugsToStockOpnameTabList is created in a different file because it needs to be a Client Component to import the icons, while we want the other parts to be Server Components.
export default function DrugsToStockOpnameTabList(): React.ReactElement {
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <TabList>
            <Tab icon={ShoppingBagIcon}>Berdasarkan Penjualan</Tab>
            <Tab icon={BookOpenIcon}>Berdasarkan Semua Obat</Tab>
        </TabList>
    )
}