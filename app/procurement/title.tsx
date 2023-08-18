'use client'

import {Title} from "@tremor/react"
import PrintButton from "@/app/procurement/print-button"

export default function ProcurementTitle() {
    return (
        <>
            <Title>Pesanan Apotek Aulia Farma ({new Date().toLocaleDateString("id-ID")})</Title>
            <PrintButton/>
        </>
    )
}