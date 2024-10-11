import React from "react"
import DrugSelectorClient from "./drug-selector-client"
import { auth } from "@/lib/auth"
import { getDrugs } from "@/lib/api/drugv2"

export async function DrugSelector(): Promise<React.ReactElement> {
    const session = await auth()
    const { drugs } = await getDrugs(session)

    return <DrugSelectorClient drugs={drugs} />
}

export function DrugSelectorFallback(): React.ReactElement {
    return <DrugSelectorClient disabled drugs={[]} />
}