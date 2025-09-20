import { getDrugs } from "@/lib/api/drugv2"
import PriceListTableClient from "./table-client"
import { auth } from "@/lib/auth"

export default function PriceListTable(): React.ReactElement {
    const sessionPromise = auth()
    const drugsPromise = sessionPromise
        .then((session) => getDrugs(session))
        .then((drugs) => drugs.drugs)

    return (
        <PriceListTableClient
            sessionPromise={sessionPromise}
            initialDrugsPromise={drugsPromise}
        />
    )
}
