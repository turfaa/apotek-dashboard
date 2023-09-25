import {useNavigation} from "@/lib/navigation"
import {lazy} from "react"

export default function Home(): React.ReactElement {
    const {homepage} = useNavigation()
    const Homepage = lazy(() => import(`@/app/${homepage}/page`))

    return <Homepage/>
}
