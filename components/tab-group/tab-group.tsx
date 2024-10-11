"use client"

import {
    Card,
    TabPanels,
    Text,
    TabGroup as Underlying,
    TabGroupProps as UnderlyingProps,
} from "@tremor/react"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import React, { useTransition } from "react"

export interface TabGroupProps extends UnderlyingProps {
    tabLabels: string[]
}

export function TabGroup({
    tabLabels,
    children,
    ...underlyingProps
}: TabGroupProps): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const currentIndex = tabLabels.findIndex(
        (label) =>
            label.toLowerCase() == searchParams.get("tab")?.toLowerCase(),
    )

    return (
        <Underlying
            {...underlyingProps}
            index={currentIndex == -1 ? 0 : currentIndex}
            onIndexChange={(index) => {
                if (index < 0 || index >= tabLabels.length) {
                    return
                }

                const params: URLSearchParams = new URLSearchParams(
                    searchParams,
                )
                params.set("tab", tabLabels[index])

                startTransition(() => {
                    push(`${pathname}?${params.toString()}`)
                })
            }}
        >
            {React.Children.map(children, (child) => {
                if ((child.type as any)._payload?.value !== TabPanels) {
                    return child
                }

                if (isPending) {
                    return (
                        <Card className="mt-4">
                            <Text>Loading...</Text>
                        </Card>
                    )
                }

                return child
            })}
        </Underlying>
    )
}
