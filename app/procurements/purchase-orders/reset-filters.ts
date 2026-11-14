"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"

const resetEvent = "purchase-order-letters:reset-filters"

// Clears every Riwayat filter by navigating to the bare page. Returns the
// reset function and whether the navigation is pending.
export function useResetFilters(): [() => void, boolean] {
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()

    const reset = () => {
        window.dispatchEvent(new Event(resetEvent))
        startTransition(() => router.push(pathname))
    }

    return [reset, isPending]
}

// Counts resets, as a key to remount inputs that keep their own copy of the
// URL value (the search box and the date picker).
export function useResetCount(): number {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const onReset = () => setCount((c) => c + 1)
        window.addEventListener(resetEvent, onReset)
        return () => window.removeEventListener(resetEvent, onReset)
    }, [])

    return count
}
