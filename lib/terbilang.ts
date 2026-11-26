// Indonesian number words, as written for quantities on a surat pesanan
// (e.g. 12 → "dua belas"). A port of purchaseorder/terbilang.go in
// vmedis-proxy-api, which prints them on the PDF; both are tested against the
// same cases (lib/terbilang.cases.json is a copy of its testdata).

const digits = [
    "nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
    "sepuluh", "sebelas",
]

const scales: [number, string][] = [
    [1_000_000_000_000, "triliun"],
    [1_000_000_000, "miliar"],
    [1_000_000, "juta"],
    [1_000, "ribu"],
]

export function terbilang(n: number): string {
    if (!Number.isSafeInteger(n) || n < 0) {
        throw new RangeError(`terbilang: ${n} is not a whole number ≥ 0`)
    }
    if (n === 0) return digits[0]

    const words: string[] = []
    for (const [value, name] of scales) {
        if (n < value) continue

        const count = Math.floor(n / value)
        n %= value

        if (count === 1 && name === "ribu") {
            words.push("seribu")
        } else {
            words.push(belowThousand(count), name)
        }
    }

    if (n > 0) words.push(belowThousand(n))

    return words.join(" ")
}

function belowThousand(n: number): string {
    const words: string[] = []

    const hundreds = Math.floor(n / 100)
    if (hundreds > 0) {
        words.push(hundreds === 1 ? "seratus" : `${digits[hundreds]} ratus`)
        n %= 100
    }

    if (n === 0) {
        // Nothing after the hundreds.
    } else if (n < 12) {
        words.push(digits[n])
    } else if (n < 20) {
        words.push(digits[n - 10], "belas")
    } else {
        words.push(digits[Math.floor(n / 10)], "puluh")
        if (n % 10 > 0) words.push(digits[n % 10])
    }

    return words.join(" ")
}
