"use client"

import { usePurchaseOrders } from "@/lib/api/hooks"
import { usePrintMode } from "@/lib/print-mode"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

export default function RefreshButton(): React.ReactElement {
    const { isLoading, refresh } = usePurchaseOrders()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Button
            variant="outline"
            disabled={isLoading}
            // Ideally, we should set search query to empty string here,
            // but the update to the search query is not reflected in the search input for performance purposes.
            onClick={() => refresh()}
        >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
        </Button>
    )
}
