"use client"

import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"
import useSearch from "@/lib/search-hook"
import { usePrintMode } from "@/lib/print-mode"

export interface SearchButtonProps {
    disabled?: boolean
}

export function SearchButton({
    disabled,
}: SearchButtonProps): React.ReactElement {
    const { query, setQuery } = useSearch()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Input
            placeholder="Cari obat..."
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setQuery(event.target.value)
            }
            defaultValue={query}
            disabled={disabled}
            onFocus={(e) => e.target.select()}
        />
    )
}
