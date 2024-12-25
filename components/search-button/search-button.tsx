"use client"

import { Input } from "@/components/ui/input"
import { ChangeEvent } from "react"
import useSearch from "@/lib/search-hook"
import { usePrintMode } from "@/lib/print-mode"

export interface SearchButtonProps {
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function SearchButton({
    placeholder,
    disabled,
    className,
}: SearchButtonProps): React.ReactElement {
    const { query, setQuery } = useSearch()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <Input
            className={className}
            placeholder={placeholder ?? "Cari obat..."}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setQuery(event.target.value)
            }
            defaultValue={query}
            disabled={disabled}
            onFocus={(e) => e.target.select()}
        />
    )
}
