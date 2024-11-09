import { auth } from "@/lib/auth"
import { allowedNavigations, homepage } from "@/lib/navigation"
import { lazy } from "react"

export default async function Home(): Promise<React.ReactElement> {
    const session = await auth()
    const home = homepage(allowedNavigations(session?.user?.role))
    const Homepage = lazy(() => import(`@/app/${home}/page`))

    return <Homepage />
}
