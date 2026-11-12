import { auth } from "@/lib/auth"
import { allowedNavigations, homepage } from "@/lib/navigation"

export default async function Home(): Promise<React.ReactElement> {
    const session = await auth()
    const home = homepage(allowedNavigations(session?.user?.role))

    // The homepage depends on the user's role, so load that page's module on demand.
    // While it loads, app/loading.tsx is shown.
    const { default: Homepage } = await import(`@/app/${home}/page`)

    return <Homepage />
}
