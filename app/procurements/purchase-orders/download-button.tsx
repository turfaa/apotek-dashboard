"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadWithToast } from "@/components/purchase-order-letter/create"

export interface DownloadButtonProps {
    id: number
    number: string
    size?: "sm" | "default"
    variant?: "outline" | "default"
}

export function DownloadButton({
    id,
    number,
    size = "default",
    variant = "outline",
}: DownloadButtonProps): React.ReactElement {
    const [isDownloading, setIsDownloading] = useState(false)

    return (
        <Button
            variant={variant}
            size={size}
            disabled={isDownloading}
            onClick={async () => {
                setIsDownloading(true)
                await downloadWithToast(id, number)
                setIsDownloading(false)
            }}
        >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {isDownloading ? "Mengunduh..." : "Unduh PDF"}
        </Button>
    )
}
