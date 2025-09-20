import React, { Suspense, use } from "react"
import DrugSelectorClient from "./drug-selector-client"
import { auth } from "@/lib/auth"
import { getDrugs } from "@/lib/api/drugv2"

export function DrugSelector(): React.ReactElement {
    return (
        <Suspense fallback={<DrugSelectorFallback />}>
            <DrugSelectorServerFetch />
        </Suspense>
    )
}

export function DrugSelectorServerFetch(): React.ReactElement {
    const session = use(auth())
    const { drugs } = use(getDrugs(session))

    return <DrugSelectorClient drugs={drugs} />
}

export function DrugSelectorFallback(): React.ReactElement {
    return <DrugSelectorClient disabled drugs={[]} />
}
