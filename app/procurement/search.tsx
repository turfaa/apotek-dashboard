"use client"

import {TextInput} from "@tremor/react"
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid"
import {ChangeEvent} from "react"
import useSearch from "@/app/procurement/search-hook"
import {useProcurementRecommendations} from "@/lib/api/hooks"
import {usePrintMode} from "@/lib/print-mode"

export default function Search(): React.ReactElement {
    const {query, setQuery} = useSearch()
    const {isLoading} = useProcurementRecommendations()
    const {isPrintMode} = usePrintMode()

    if (isPrintMode) {
        return <></>
    }

    return (
        <TextInput
            icon={MagnifyingGlassIcon}
            placeholder="Cari obat..."
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            defaultValue={query}
            disabled={isLoading}
        />
    )
}