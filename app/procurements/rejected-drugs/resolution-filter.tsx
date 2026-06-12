"use client"

import React, { use, useTransition } from "react"
import { useQueryState } from "nuqs"
import { Options } from "@/cui/types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const allResolutions = "ALL"

export interface ResolutionFilterProps {
    optionsPromise: Promise<Options>
}

export function ResolutionFilter({
    optionsPromise,
}: ResolutionFilterProps): React.ReactElement {
    const { options } = use(optionsPromise)
    const [isPending, startTransition] = useTransition()
    const [resolutions, setResolutions] = useQueryState("resolutions", {
        shallow: false,
        startTransition,
    })

    return (
        <Select
            value={resolutions ?? allResolutions}
            disabled={isPending}
            onValueChange={(value) =>
                setResolutions(value === allResolutions ? null : value)
            }
        >
            <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter resolusi" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={allResolutions}>Semua Resolusi</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

export function ResolutionFilterFallback(): React.ReactElement {
    return (
        <Select disabled>
            <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter resolusi" />
            </SelectTrigger>
        </Select>
    )
}
