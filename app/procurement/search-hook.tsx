import {ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams} from "next/navigation"
import {useTransition} from "react"

export interface SearchHook {
    query: string
    setQuery: (query: string) => void
    isPending: boolean
}

export default function useSearch() {
    const {replace} = useRouter()
    const pathname: string = usePathname()
    const [isPending, startTransition] = useTransition()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    function handleSearch(query: string): void {
        const trimmedQuery = query.trim()
        const params: URLSearchParams = new URLSearchParams(window.location.search)
        if (trimmedQuery) {
            params.set("q", trimmedQuery)
        } else {
            params.delete("q")
        }

        startTransition(() => {
            replace(`${pathname}?${params.toString()}`)
        })
    }

    return {
        query: searchParams.get("q") ?? "",
        setQuery: handleSearch,
        isPending,
    }
}