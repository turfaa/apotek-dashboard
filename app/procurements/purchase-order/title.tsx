"use client"

import { Title, Subtitle, Text } from "@/components/typography"
import { usePurchaseOrders } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import useSearch from "@/lib/search-hook"
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
        <div className="flex flex-row">
            <div className="flex flex-col items-start">
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
            </div>
        </div>
    )
}
