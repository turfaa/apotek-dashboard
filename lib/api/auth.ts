import { fetchAPI } from "@/lib/api/base"

export interface UserInfo {
    email: string
    role: Role
}

export enum Role {
    ADMIN = "admin",
    STAFF = "staff",
    RESELLER = "reseller",
    GUEST = "guest",
}

interface LoginRequest {
    email: string
}

export async function postLogin(request: LoginRequest): Promise<UserInfo> {
    return await fetchAPI<UserInfo>("POST", "/users/login", request, {
        next: {
            tags: ["auth"],
        },
    })
}
