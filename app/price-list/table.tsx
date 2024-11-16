import { getDrugs } from "@/lib/api/drugv2"
import PriceListTableClient from "./table-client"
import { auth } from "@/lib/auth"
import { use } from "react"

export default function PriceListTable(): React.ReactElement {
    const session = use(auth())
    const { drugs } = use(getDrugs(session))

    return (
        <PriceListTableClient session={session} initialDrugs={drugs} />
    )
}
