import { test } from "node:test"
import assert from "node:assert/strict"
import cases from "./terbilang.cases.json"
import { terbilang } from "./terbilang"

test("terbilang matches the backend's cases", () => {
    for (const [n, want] of cases as [number, string][]) {
        assert.equal(terbilang(n), want, `terbilang(${n})`)
    }
})

test("terbilang rejects negative and fractional numbers", () => {
    assert.throws(() => terbilang(-1), RangeError)
    assert.throws(() => terbilang(1.5), RangeError)
})
