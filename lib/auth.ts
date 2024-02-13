import { postLogin, Role } from "@/lib/api/auth"
import NextAuth, { NextAuthConfig, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import google from "next-auth/providers/google"

export const authConfig: NextAuthConfig = {
    providers: [google],

    callbacks: {
        async jwt({ token, user, trigger }): Promise<JWT> {
            if (trigger != "signIn") {
                return token
            }

            if (user.email) {
                const backendUser = await postLogin({ email: user.email })
                token.role = backendUser.role
            }

            return token
        },

        session({ session, token }): Session {
            if (session.user) {
                session.user.role = token.role as Role
            }

            return session
        },

        authorized({ auth }): boolean {
            return true
        },
    },

    experimental: {
        enableWebAuthn: true,
    },
}

export const {
    auth,
    handlers: { GET, POST },
} = NextAuth(authConfig)
