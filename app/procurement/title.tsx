'use client'

import {Flex, Subtitle, Title} from "@tremor/react"
import PrintButton from "@/app/procurement/print-button"
import {usePrintMode} from "@/lib/print-mode"
import useSearch from "@/app/procurement/search-hook"
import {useEffect, useState} from "react"

export default function ProcurementTitle() {
    const {isPrintMode, setPrintMode} = usePrintMode()
    const {query} = useSearch()
    const [pageLoadCompleted, setPageLoadCompleted] = useState(false)

    useEffect(() => setPageLoadCompleted(true), [])

    useEffect(() => {
        if (isPrintMode && pageLoadCompleted) {
            window.print()
            setPrintMode(false)
        }
    }, [isPrintMode, setPrintMode, pageLoadCompleted])

    const showQuery = isPrintMode && query.length > 0

    return (
        <Flex flexDirection="row">
            <Flex flexDirection="col" alignItems="start">
                <Title>Pesanan Apotek Aulia Farma ({new Date().toLocaleDateString("id-ID")})</Title>
                {showQuery && <Subtitle>Kepada: {query}</Subtitle>}
            </Flex>

            <PrintButton/>
        </Flex>
    )
}