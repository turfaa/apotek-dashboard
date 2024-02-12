"use client"

import { usePrintMode } from "@/lib/print-mode"
import useSearch from "@/lib/search-hook"
import { Flex, Subtitle, Title } from "@tremor/react"

export default function PurchaseOrderTitle() {
    const { isPrintMode } = usePrintMode()
    const { query } = useSearch()

    const showQuery = isPrintMode && query.length > 0

    return (
        <Flex flexDirection="row">
            <Flex flexDirection="col" alignItems="start">
                <Title>
                    Pesanan Apotek Aulia Farma (
                    {new Date().toLocaleDateString("id-ID")})
                </Title>
                {showQuery && <Subtitle>Kepada: {query}</Subtitle>}
            </Flex>
        </Flex>
    )
}
