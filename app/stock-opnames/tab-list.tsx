"use client"

import { BookOpenIcon, CircleStackIcon } from "@heroicons/react/24/outline"
import { Tab, TabList } from "@tremor/react"

// StockOpnameTabList is created in a different file because it needs to be a Client Component to import the icons, while we want the other parts to be Server Components.
export default function StockOpnameTabList(): React.ReactElement {
    return (
        <TabList>
            <Tab icon={BookOpenIcon}>Ringkasan</Tab>
            <Tab icon={CircleStackIcon}>Detail</Tab>
        </TabList>
    )
}