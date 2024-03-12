"use client"

import { usePurchaseOrders } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import useSearch from "@/lib/search-hook"
import { Flex, Subtitle, Title } from "@tremor/react"
import { useEffect, useState } from "react"

export default function PurchaseOrderTitle() {
    const [ssrCompleted, setSsrCompleted] = useState(false)
    useEffect(() => setSsrCompleted(true), [])

    const { isPrintMode } = usePrintMode()
    const { query } = useSearch()
    const { computedAt, isLoading, error } = usePurchaseOrders()

    const showComputedAt =
        !isPrintMode &&
        ssrCompleted &&
        !isLoading &&
        !error &&
        computedAt !== undefined
    const showQuery = isPrintMode && query.length > 0

    return (
        <Flex flexDirection="row">
            <Flex flexDirection="col" alignItems="start">
                <Title>
                    Pesanan Apotek Aulia Farma (
                    {new Date().toLocaleDateString("id-ID")})
                </Title>
                {showComputedAt && (
                    <Subtitle>
                        Dihitung pada: {computedAt.toLocaleString("id-ID")}
                    </Subtitle>
                )}
                {showQuery && <Subtitle>Kepada: {query}</Subtitle>}
            </Flex>
        </Flex>
    )
}
