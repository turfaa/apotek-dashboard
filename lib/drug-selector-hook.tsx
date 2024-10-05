import { useCallback, useTransition } from "react"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { Drug } from "@/lib/api/drugv2"

export interface DrugSelectorHook {
    drugs: Drug[]

    selectedDrug?: Drug
    setSelectedDrug: (drugCode: string | null) => void
}

export function useDrugSelector(drugs: Drug[]): DrugSelectorHook {
    const [isPending, startTransition] = useTransition()
    const { push } = useRouter()
    const pathname: string = usePathname()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    const setSelectedDrug = useCallback((drugCode: string | null) => {
        const params: URLSearchParams = new URLSearchParams(
            window.location.search,
        )

        if (drugCode == "" || drugCode == null) {
            params.delete("drug-code")
        } else {
            params.set("drug-code", drugCode)
        }

        startTransition(() => {
            push(`${pathname}?${params.toString()}`)
        })
    }, [pathname, push])

    const drugCodeFromParams = searchParams.get("drug-code")
    const drugCode = drugCodeFromParams ? drugCodeFromParams : ""

    const selectedDrug = drugs.find((drug) => drug.vmedisCode === drugCode)

    return {
        drugs,
        selectedDrug,
        setSelectedDrug,
    }
}
