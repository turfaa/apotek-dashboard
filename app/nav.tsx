import Navbar from "@/app/navbar"
import { auth } from "@/lib/auth"

export default async function Nav(): Promise<React.ReactElement> {
    const session = await auth()
    return <Navbar session={session} />
}
