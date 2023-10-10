import {allowedPages, homepage} from "@/lib/navigation"
import {lazy} from "react"
import {getServerSession} from "next-auth/next"
import {authOptions} from "@/lib/auth"

export default async function Home(): Promise<React.ReactElement> {
    const session = await getServerSession(authOptions)
    const home = homepage(allowedPages(session?.user?.role))
    const Homepage = lazy(() => import(`@/app/${home}/page`))

    return <Homepage/>
}
