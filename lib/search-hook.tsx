import { useQueryState } from "nuqs"
import { useCallback, useTransition } from "react"

export interface SearchHook {
    query: string
    setQuery: (query: string) => void
    isPending: boolean
}

export default function useSearch(): SearchHook {
    const [query, setRawQuery] = useQueryState("query", { throttleMs: 500 })
    const [isPending, startTransition] = useTransition()

    const setQuery = useCallback(
        (q: string) => {
            const trimmedQuery = titleCase(q).trim()

            startTransition(() => {
                if (trimmedQuery == "") {
                    setRawQuery(null)
                } else {
                    setRawQuery(trimmedQuery)
                }
            })
        },
        [setRawQuery],
    )

    return {
        query: query ?? "",
        setQuery,
        isPending,
    }
}

function titleCase(str: string): string {
    const strs = str.toLowerCase().split(" ")
    for (let i = 0; i < strs.length; i++) {
        strs[i] = strs[i].charAt(0).toUpperCase() + strs[i].slice(1)
    }
    return strs.join(" ")
}
