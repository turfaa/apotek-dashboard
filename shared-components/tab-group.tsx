"use client"

import { TabGroup as Underlying, TabGroupProps as UnderlyingProps } from "@tremor/react"
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation"

export interface TabGroupProps extends UnderlyingProps {
    tabLabels: string[]
}

export default function TabGroup({ tabLabels, ...underlyingProps }: TabGroupProps): React.ReactElement {
    const { push } = useRouter()
    const pathname: string = usePathname()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const currentIndex = tabLabels.findIndex(label => label.toLowerCase() == searchParams.get("tab")?.toLowerCase())

    return (
        <Underlying
            {...underlyingProps}
            index={currentIndex == -1 ? 0 : currentIndex}
            onIndexChange={index => {
                if (index < 0 || index >= tabLabels.length) {
                    return
                }

                const params: URLSearchParams = new URLSearchParams(searchParams)
                params.set("tab", tabLabels[index])
                push(`${pathname}?${params.toString()}`)
            }}
        />
    )
}