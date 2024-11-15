"use client"

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import React, { useTransition } from "react"
import { Card } from "@/components/ui/card"
import Loading from "@/components/loading"
import { usePrintMode } from "@/lib/print-mode"

export interface TabLabel {
    tag: string
    label: string
    icon?: React.ReactNode
}

export interface TabGroupProps {
    tabLabels: TabLabel[]
    children: React.ReactNode
    className?: string
}

export function TabGroup({
    tabLabels,
    children,
    className,
}: TabGroupProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const { isPrintMode } = usePrintMode()

    const currentTab = searchParams.get("tab")?.toLowerCase()
    const defaultValue = currentTab && tabLabels.map(t => t.tag.toLowerCase()).includes(currentTab)
        ? currentTab
        : tabLabels[0].tag.toLowerCase()

    return (
        <Tabs
            defaultValue={defaultValue}
            className={className}
            onValueChange={(value) => {
                const params = new URLSearchParams(searchParams)
                params.set("tab", value)

                startTransition(() => {
                    push(`${pathname}?${params.toString()}`)
                })
            }}
        >
            {!isPrintMode && (
                <div className="overflow-x-auto">
                    <TabsList className="w-max">
                        {tabLabels.map((label) => (
                            <TabsTrigger
                                key={label.tag}
                                value={label.tag}
                                className="whitespace-nowrap"
                            >
                                <span className="flex gap-2">
                                    {label.icon}
                                    {label.label}
                                </span>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
            )}

            {isPending ? (
                <Card className="mt-4 p-4">
                    <Loading />
                </Card>
            ) : (
                React.Children.map(children, (child) => {
                    if (!React.isValidElement(child)) return null
                    return child
                })
            )}
        </Tabs>
    )
}
