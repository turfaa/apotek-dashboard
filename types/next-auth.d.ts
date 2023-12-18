import { DefaultSession } from "next-auth"
import { Role } from "@/lib/api/auth"

declare module "next-auth" {
    interface Session {
        user?: {
            role?: Role
        } & DefaultSession["user"]
    }
}
