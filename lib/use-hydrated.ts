import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * Returns `false` during server rendering and hydration, then `true` once the
 * component is running on the client. Use it to defer client-only UI (e.g. state
 * restored from localStorage) without a mismatch between server and client HTML.
 */
export function useHydrated(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    )
}
