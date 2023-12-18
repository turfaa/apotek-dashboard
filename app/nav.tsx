import Navbar from "@/app/navbar"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"

export default async function Nav(): Promise<React.ReactElement> {
    const session = await getServerSession(authOptions)
    return <Navbar session={session} />
}
