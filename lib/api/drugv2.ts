import { fetchAPI } from "@/lib/api/base"
import { UserInfo } from "./auth"
import { Session } from "next-auth"

export interface DrugsResponse {
    drugs: Drug[]
}

export interface Drug {
    vmedisCode: string
    name: string
    sections: Section[]
}

export interface Section {
    title: string
    rows: string[]
}

export async function getDrugs(session?: Session | null): Promise<DrugsResponse> {
    return fetchAPI(
        "GET",
        "/drugs",
        null,
        {
            next: {
                revalidate: 60, // Revalidate every minute.
            },
        },
        {
            version: "v2",
            session: session,
        }
    )
}
