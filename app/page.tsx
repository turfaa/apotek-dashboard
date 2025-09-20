import Loading from "./loading"
import { auth } from "@/lib/auth"
import { allowedNavigations, homepage } from "@/lib/navigation"
import dynamic from "next/dynamic"

export default async function Home(): Promise<React.ReactElement> {
    const session = await auth()
    const home = homepage(allowedNavigations(session?.user?.role))
    const Homepage = dynamic(() => import(`@/app/${home}/page`), {
        loading: () => <Loading />,
        ssr: true,
    })

    return <Homepage />
}
