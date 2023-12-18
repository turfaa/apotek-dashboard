import { fetchAPI } from "@/lib/api/base"
import { Drug } from "@/lib/api/drug"

export interface DrugsToStockOpnameResponse {
    drugs: Drug[]
}

export enum DrugsToStockOpnameMode {
    SalesBased = "sales-based",
    Conservative = "conservative",
}

export async function getDrugsToStockOpname(
    date?: string,
    mode?: DrugsToStockOpnameMode,
): Promise<DrugsToStockOpnameResponse> {
    return await fetchAPI<DrugsToStockOpnameResponse>(
        "GET",
        `/drugs/to-stock-opname/?mode=${
            mode ?? DrugsToStockOpnameMode.SalesBased
        }${date ? `&date=${date}` : ""}`,
        null,
        {
            next: {
                revalidate: 0, // Always revalidate.
            },
        },
    )
}
