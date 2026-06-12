"use client"

import React, { ChangeEvent, useTransition } from "react"
import { useQueryState } from "nuqs"
import { Input } from "@/components/ui/input"
import Loading from "@/components/loading"

export function SearchFilter(): React.ReactElement {
    const [isPending, startTransition] = useTransition()
    const [query, setQuery] = useQueryState("query", {
        shallow: false,
        throttleMs: 500,
        startTransition,
    })

    return (
        <div className="flex gap-2 items-center w-full sm:w-[300px]">
            <Input
                placeholder="Cari nama obat atau catatan..."
                defaultValue={query ?? ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setQuery(event.target.value.trim() || null)
                }
                onFocus={(e) => e.target.select()}
            />
            {isPending && <Loading />}
        </div>
    )
}
