import GoogleProvider from "next-auth/providers/google"
import {postLogin, Role} from "@/lib/api/auth"
import NextAuth, {AuthOptions, Session} from "next-auth"
import {JWT} from "next-auth/jwt"

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],

    callbacks: {
        async jwt({token, user, trigger}): Promise<JWT> {
            if (trigger != "signIn") {
                return token
            }

            if (user.email) {
                const backendUser = await postLogin({email: user.email})
                token.role = backendUser.role
            }

            return token
        },

        session({session, token}): Session {
            if (session.user) {
                session.user.role = token.role as Role
            }

            return session
        },
    },
}

export const nextAuth = NextAuth(authOptions)