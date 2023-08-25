import {ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams} from "next/navigation"
import {useTransition} from "react"

export interface SearchHook {
    query: string
    setQuery: (query: string) => void
    isPending: boolean
}

export default function useSearch(): SearchHook {
    const {replace} = useRouter()
    const pathname: string = usePathname()
    const [isPending, startTransition] = useTransition()
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    function handleSearch(query: string): void {
        const trimmedQuery = titleCase(query).trim()
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

function titleCase(str: string): string {
    const strs = str.toLowerCase().split(' ')
    for (var i = 0; i < strs.length; i++) {
        strs[i] = strs[i].charAt(0).toUpperCase() + strs[i].slice(1)
    }
    return strs.join(' ')
}
