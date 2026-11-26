import { test } from "node:test"
import assert from "node:assert/strict"
import {
    describePackage,
    golonganWarning,
    parseOrderedQuantity,
    prefillControlledItem,
    quantityWords,
    validateControlledItem,
} from "./purchase-order-letter-items"

const units = [
    { unit: "Tablet", parentUnit: "", conversionToParentUnit: 0 },
    { unit: "Strip", parentUnit: "Tablet", conversionToParentUnit: 10 },
    { unit: "Box", parentUnit: "Strip", conversionToParentUnit: 10 },
]

test("parseOrderedQuantity splits the number and the unit", () => {
    assert.deepEqual(parseOrderedQuantity("3 Box"), { quantity: "3", unit: "Box" })
    assert.deepEqual(parseOrderedQuantity(" 012strip "), { quantity: "12", unit: "strip" })
    assert.deepEqual(parseOrderedQuantity("10"), { quantity: "10", unit: "" })
    assert.deepEqual(parseOrderedQuantity("1,5 box"), { quantity: "", unit: "" })
    assert.deepEqual(parseOrderedQuantity("setengah box"), { quantity: "", unit: "" })
})

test("describePackage adds the Vmedis conversion", () => {
    assert.equal(describePackage("box", units), "Box @ 10 Strip")
    assert.equal(describePackage("Tablet", units), "Tablet")
    assert.equal(describePackage("Botol", units), "Botol")
    assert.equal(describePackage("", units), "")
})

test("prefillControlledItem", () => {
    assert.deepEqual(prefillControlledItem("2 Box", units), {
        quantity: "2",
        smallestPackage: "Box @ 10 Strip",
        note: "",
    })
})

test("validateControlledItem", () => {
    const valid = { quantity: "12", smallestPackage: "Box", note: "" }
    assert.deepEqual(validateControlledItem(valid), {})
    assert.equal(validateControlledItem({ ...valid, quantity: "3 box" }).quantity, "Angka saja")
    assert.equal(validateControlledItem({ ...valid, quantity: "" }).quantity, "Wajib diisi")
    assert.equal(validateControlledItem({ ...valid, quantity: "0" }).quantity, "Minimal 1")
    assert.equal(validateControlledItem({ ...valid, quantity: "1000000" }).quantity, "Terlalu besar")
    assert.equal(validateControlledItem({ ...valid, smallestPackage: " " }).smallestPackage, "Wajib diisi")
    assert.ok(validateControlledItem({ ...valid, note: "x".repeat(101) }).note)
})

test("quantityWords", () => {
    assert.equal(quantityWords("12"), "dua belas")
    assert.equal(quantityWords("3 box"), undefined)
})

test("golonganWarning only for another drug class", () => {
    const details = {
        drugVmedisCode: "A",
        found: true,
        activeIngredient: "x",
        dosageFormStrength: "y",
        units: [],
        vmedisGolongan: "Obat Keras",
        classMatches: false,
        missingInVmedis: [],
    }
    assert.equal(
        golonganWarning(details, "OOT"),
        "Golongan di Vmedis: Obat Keras. Pastikan obat ini termasuk OOT.",
    )
    assert.equal(golonganWarning({ ...details, classMatches: null }, "OOT"), undefined)
    assert.equal(golonganWarning({ ...details, classMatches: true }, "OOT"), undefined)
})
