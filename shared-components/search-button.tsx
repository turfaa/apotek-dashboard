"use client"

import { TextInput } from "@tremor/react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { ChangeEvent } from "react"
import useSearch from "@/lib/search-hook"
import { usePrintMode } from "@/lib/print-mode"

export interface SearchButtonProps {
    disabled?: boolean
}

export default function SearchButton({
    disabled,
}: SearchButtonProps): React.ReactElement {
    const { query, setQuery } = useSearch()
    const { isPrintMode } = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <TextInput
            icon={MagnifyingGlassIcon}
            placeholder="Cari obat..."
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setQuery(event.target.value)
            }
            defaultValue={query}
            disabled={disabled}
        />
    )
}
