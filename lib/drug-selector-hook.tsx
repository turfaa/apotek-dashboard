import { useCallback, useTransition } from "react"
import {
    ReadonlyURLSearchParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import { Drug } from "@/lib/api/drugv2"
import { useDrugsV2 } from "@/lib/api/hooks"

export interface DrugSelectorHook {
    drugs: Drug[]
    isLoading: boolean
    error?: Error

    selectedDrug?: Drug
    setSelectedDrug: (drugCode: string | null) => void
}

export function useDrugSelector(): DrugSelectorHook {
    const { data: drugs, isLoading, error } = useDrugsV2()

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

    if (isLoading) {
        return {
            drugs: [],
            isLoading,
            error,
            selectedDrug: undefined,
            setSelectedDrug: () => { },
        }
    }

    const drugCodeFromParams = searchParams.get("drug-code")
    const drugCode = drugCodeFromParams ? drugCodeFromParams : ""

    const selectedDrug = drugs?.drugs.find((drug) => drug.vmedisCode === drugCode)

    return {
        drugs: drugs?.drugs ?? [],
        isLoading,
        error,
        selectedDrug,
        setSelectedDrug,
    }
}
