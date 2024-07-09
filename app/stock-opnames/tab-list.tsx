"use client"

import { usePrintMode } from "@/lib/print-mode"
import {
    BoltIcon,
    BookOpenIcon,
    CircleStackIcon,
} from "@heroicons/react/24/outline"
import { Tab, TabList } from "@tremor/react"

// StockOpnameTabList is created in a different file because it needs to be a Client Component to import the icons, while we want the other parts to be Server Components.
export default function StockOpnameTabList(): React.ReactElement {
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <TabList>
            <Tab icon={BoltIcon}>Ringkasan</Tab>
            <Tab icon={BookOpenIcon}>Compact</Tab>
            <Tab icon={CircleStackIcon}>Detail</Tab>
        </TabList>
    )
}
