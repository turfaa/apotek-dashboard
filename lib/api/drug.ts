import { fetchAPI } from "@/lib/api/base"

export interface DrugsResponse {
    drugs: DrugWithUnits[]
}

export interface DrugWithUnits extends Drug {
    units: Unit[]
}

export interface Drug {
    vmedisCode: string
    name: string
    manufacturer: string
    supplier: string
    minimumStock: string
}

export interface Unit {
    unit: string
    unitOrder: number
    parentUnit?: string
    conversionToParentUnit?: number

    priceOne: number
    priceTwo: number
    priceThree: number
}

export async function getDrugs(): Promise<DrugsResponse> {
    return fetchAPI("GET", "/drugs", null, {
        next: {
            revalidate: 3600, // Revalidate every hour.
        },
    })
}
