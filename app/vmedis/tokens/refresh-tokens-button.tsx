"use client"

import { useTokenRefreshStatus } from "@/lib/api/hooks"
import { UpdateIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function RefreshTokensButton(): React.ReactElement {
    const { isRefreshing, isLoading, isStarting, refresh } =
        useTokenRefreshStatus()

    const disabled = isRefreshing || isStarting || isLoading

    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={async () => {
                try {
                    await refresh()
                    toast.success(
                        "Pembaruan status token dimulai. Proses ini biasanya selesai dalam beberapa saat.",
                    )
                } catch {
                    toast.error("Gagal memulai pembaruan status token")
                }
            }}
        >
            <UpdateIcon
                className={`w-4 h-4 mr-2${isRefreshing ? " animate-spin" : ""}`}
            />
            {isRefreshing ? "Memperbarui..." : "Perbarui Status"}
        </Button>
    )
}
