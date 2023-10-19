import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { startTransition } from "react"
import { Role } from "./api/auth"

const rolesAllowedToPrint = [Role.ADMIN, Role.STAFF]
export interface PrintModeHook {
    isPrintMode: boolean
    setPrintMode: (isPrintMode: boolean) => void
}

export function usePrintMode(role?: Role): PrintModeHook {
    const { replace } = useRouter()
    const pathname: string = usePathname()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    if (role && !rolesAllowedToPrint.includes(role)) {
        return {
            isPrintMode: false,
            setPrintMode: () => { },
        }
    }

    function handlePrintMode(printMode: boolean): void {
        const params: URLSearchParams = new URLSearchParams(window.location.search)
        if (printMode) {
            params.set("print", Boolean(printMode).toString())
        } else {
            params.delete("print")
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`)
        })
    }

    return {
        isPrintMode: (searchParams.get("print")?.toLowerCase() ?? "false") == "true",
        setPrintMode: handlePrintMode,
    }
}