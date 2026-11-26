// The item fields of controlled SP templates (Prekursor, OOT): prefill and
// validation, shared by the create dialog and its tests. The backend checks
// the same rules (purchaseorder/service.go in vmedis-proxy-api).

import { PurchaseOrderLetterItemDetails } from "@/lib/api/purchase-order-letter"
import { terbilang } from "@/lib/terbilang"

export const maxControlledQuantity = 999_999
export const maxSmallestPackageLength = 100
export const maxNoteLength = 100

// The editable fields of a controlled item.
export interface ControlledItemValues {
    smallestPackage: string
    quantity: string
    note: string
}

export interface ControlledItemErrors {
    smallestPackage?: string
    quantity?: string
    note?: string
}

type Units = PurchaseOrderLetterItemDetails["units"]

// Splits the Jumlah typed in Buat Pesanan, e.g. "3 Box", into the whole
// number and the unit. A quantity that is not a whole number ("1,5 box",
// "setengah") gives no quantity, so the operator types it.
export function parseOrderedQuantity(text: string): { quantity: string; unit: string } {
    const match = text.trim().match(/^(\d+)\s*(.*)$/)
    if (!match) return { quantity: "", unit: "" }

    const [, digits, rest] = match
    // "1.5 box" or "1,5 box": the digits are not the whole quantity.
    if (/^[.,]\d/.test(rest)) return { quantity: "", unit: "" }

    return { quantity: String(Number(digits)), unit: rest.trim() }
}

// Describes a unit as a smallest package, with its conversion from Vmedis,
// e.g. "Box @ 10 Strip". The unit is matched case-insensitively; an unknown
// unit is returned as typed.
export function describePackage(unit: string, units: Units): string {
    const wanted = unit.trim().toLowerCase()
    if (!wanted) return ""

    const match = units.find((u) => u.unit.trim().toLowerCase() === wanted)
    if (!match) return unit.trim()

    if (!match.parentUnit || !(match.conversionToParentUnit > 0)) {
        return match.unit
    }

    const conversion = Number.isInteger(match.conversionToParentUnit)
        ? String(match.conversionToParentUnit)
        : match.conversionToParentUnit.toLocaleString("id-ID")
    return `${match.unit} @ ${conversion} ${match.parentUnit}`
}

// The values a controlled item starts with: from the Jumlah typed in Buat
// Pesanan and the drug's units in Vmedis.
export function prefillControlledItem(
    orderedQuantity: string,
    units: Units,
): ControlledItemValues {
    const { quantity, unit } = parseOrderedQuantity(orderedQuantity)
    return { quantity, smallestPackage: describePackage(unit, units), note: "" }
}

// Parses a controlled quantity: digits only, from 1 to the maximum.
export function parseControlledQuantity(text: string): number | undefined {
    const trimmed = text.trim()
    if (!/^\d+$/.test(trimmed)) return undefined

    const n = Number(trimmed)
    return n >= 1 && n <= maxControlledQuantity ? n : undefined
}

export function validateControlledItem(values: ControlledItemValues): ControlledItemErrors {
    const errors: ControlledItemErrors = {}

    const quantity = values.quantity.trim()
    if (!quantity) {
        errors.quantity = "Wajib diisi"
    } else if (!/^\d+$/.test(quantity)) {
        errors.quantity = "Angka saja"
    } else if (parseControlledQuantity(quantity) === undefined) {
        errors.quantity = Number(quantity) < 1 ? "Minimal 1" : "Terlalu besar"
    }

    const smallestPackage = values.smallestPackage.trim()
    if (!smallestPackage) {
        errors.smallestPackage = "Wajib diisi"
    } else if (smallestPackage.length > maxSmallestPackageLength) {
        errors.smallestPackage = `Maksimal ${maxSmallestPackageLength} karakter`
    }

    if (values.note.trim().length > maxNoteLength) {
        errors.note = `Maksimal ${maxNoteLength} karakter`
    }

    return errors
}

export function hasErrors(errors: ControlledItemErrors): boolean {
    return Object.values(errors).some(Boolean)
}

// The quantity in words, or undefined while it is not a valid quantity.
export function quantityWords(quantity: string): string | undefined {
    const n = parseControlledQuantity(quantity)
    return n === undefined ? undefined : terbilang(n)
}

// The Golongan warning of a drug whose Vmedis golongan is another drug class
// than the template's. Only a hint: golongan in Vmedis is unreliable.
export function golonganWarning(
    details: PurchaseOrderLetterItemDetails | undefined,
    templateClassName: string,
): string | undefined {
    if (details?.classMatches !== false || !details.vmedisGolongan) {
        return undefined
    }

    return `Golongan di Vmedis: ${details.vmedisGolongan}. Pastikan obat ini termasuk ${templateClassName}.`
}

// Whether the drug's zat aktif and bentuk & kekuatan are filled in Vmedis.
export function isCompleteInVmedis(details: PurchaseOrderLetterItemDetails | undefined): boolean {
    return !!details?.found && details.missingInVmedis.length === 0
}
