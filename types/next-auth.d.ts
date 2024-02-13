import { Role } from "@/lib/api/auth"
import { DefaultSession } from "next-auth"
import { NextRequest } from "next/server"

declare module "next-auth" {
    interface Session {
        user?: {
            role?: Role
        } & DefaultSession["user"]
    }

    interface NextAuthRequest extends NextRequest {
        auth: Session | null
    }
}
