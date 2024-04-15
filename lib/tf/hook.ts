import { useCallback, useMemo } from "react"
import Corpus from "./corpus"

export interface TfHook {
    search(query: string): string[]
}

export function useTf(textIds: string[], texts: string[]): TfHook {
    const corpus = useMemo(() => {
        const corpus = new Corpus(
            textIds,
            texts.map((t) => t.toLowerCase()),
        )
        return corpus
    }, [textIds, texts])

    const search = useCallback(
        (query: string): string[] => {
            return corpus
                .getResultsForQuery(query.toLowerCase())
                .map(([id]) => id)
        },
        [corpus],
    )

    return {
        search,
    }
}
