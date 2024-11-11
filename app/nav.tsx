import Navbar from "@/app/navbar"
import { auth } from "@/lib/auth"
import { use } from "react"

export default function Nav(): React.ReactElement {
    const session = use(auth())
    return <Navbar session={session} />
}
