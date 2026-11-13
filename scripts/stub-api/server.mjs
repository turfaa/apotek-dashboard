#!/usr/bin/env node
// Stub of the VMEDIS and HRIS backends for local builds and UI testing.
//
// Serves fake but well-formed data so `next build` can prerender pages and
// the app can be clicked through without access to the real backends.
//
//   npm run stub-api                 # listens on http://127.0.0.1:4010
//   VMEDIS_PROXY_URL=http://127.0.0.1:4010/vmedis/api \
//   HRIS_PROXY_URL=http://127.0.0.1:4010/hris/api npm run build
//
// Unknown routes return 404 and are logged, so missing fixtures are easy to
// spot. Writes (POST/PUT/PATCH/DELETE) are accepted and echoed back; nothing
// is persisted.

import { createServer } from "node:http"

const PORT = Number(process.env.STUB_API_PORT ?? 4010)

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const now = new Date()
const iso = (d) => d.toISOString()
const ymd = (d) => d.toLocaleDateString("en-CA")
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
const currentMonth = ymd(now).slice(0, 7)

// Handlers return JSON by default; wrap HTML endpoints with html().
const html = (body) => ({ [HTML]: `<!doctype html><html><body>${body}</body></html>` })
const HTML = Symbol("html")

const table = (header, rows) => ({
    header,
    rows: rows.map((columns, i) => ({ id: String(i + 1), columns })),
})

const drugsV1 = [
    {
        vmedisCode: "PCT500",
        name: "Paracetamol 500 mg",
        manufacturer: "Kimia Farma",
        supplier: "PT Sumber Sehat",
        minimumStock: "10 Strip",
        units: [
            { unit: "Box", unitOrder: 1, priceOne: 50000, priceTwo: 48000, priceThree: 46000 },
            { unit: "Strip", unitOrder: 2, parentUnit: "Box", conversionToParentUnit: 10, priceOne: 5500, priceTwo: 5200, priceThree: 5000 },
        ],
        stocks: ["3 Box", "4 Strip"],
    },
    {
        vmedisCode: "AMX500",
        name: "Amoxicillin 500 mg",
        manufacturer: "Indofarma",
        supplier: "PT Medika Jaya",
        minimumStock: "5 Strip",
        units: [
            { unit: "Strip", unitOrder: 1, priceOne: 8000, priceTwo: 7500, priceThree: 7000 },
        ],
        stocks: ["12 Strip"],
    },
]

const drugsV2 = drugsV1.map((d) => ({
    vmedisCode: d.vmedisCode,
    name: d.name,
    sections: [
        { title: "Harga", rows: d.units.map((u) => `${u.unit}: Rp ${u.priceOne}`) },
        { title: "Stok", rows: d.stocks },
    ],
}))

const employees = [
    { id: 1, name: "Andi", shiftFee: "75000", showInAttendances: true },
    { id: 2, name: "Budi", shiftFee: "70000", showInAttendances: true },
    { id: 3, name: "Citra", shiftFee: "80000", showInAttendances: false },
].map((e) => ({ ...e, createdAt: iso(daysAgo(365)), updatedAt: iso(daysAgo(30)) }))

const attendanceTypes = [
    { id: 1, name: "Masuk", payableType: "working", hasQuota: false },
    { id: 2, name: "Cuti", payableType: "benefit", hasQuota: true },
    { id: 3, name: "Libur", payableType: "none", hasQuota: false },
]

const workTypes = [
    { id: 1, name: "Racik obat", outcomeUnit: "racikan", multiplier: "5000", notes: "" },
    { id: 2, name: "Konsultasi", outcomeUnit: "pasien", multiplier: "10000", notes: "" },
]

const workLogs = [1, 2, 3].map((i) => ({
    id: i,
    employee: employees[(i - 1) % employees.length],
    patientName: `Pasien ${i}`,
    units: [{ id: i, workType: workTypes[(i - 1) % workTypes.length], workOutcome: String(i), workMultiplier: workTypes[(i - 1) % workTypes.length].multiplier }],
    createdAt: iso(daysAgo(i)),
}))

function attendancesForMonth(month) {
    const [y, m] = month.split("-").map(Number)
    const daysInMonth = new Date(y, m, 0).getDate()
    const dailyAttendances = []
    for (let day = 1; day <= Math.min(daysInMonth, 5); day++) {
        const date = `${month}-${String(day).padStart(2, "0")}`
        dailyAttendances.push({
            date,
            attendances: employees.slice(0, 2).map((e, i) => ({
                id: day * 10 + i,
                employeeID: e.id,
                date,
                type: attendanceTypes[(day + i) % 2],
                overtimeHours: 0,
                createdAt: iso(now),
                updatedAt: iso(now),
                lastOperatorEmployeeID: 1,
            })),
        })
    }
    return {
        dailyAttendances,
        employeeSummaries: employees.map((e) => ({
            employeeID: e.id,
            workingDays: 3,
            daysByBenefit: { Cuti: 2 },
            overtimeHours: 0,
        })),
    }
}

const salaryComponents = [
    { description: "Gaji pokok", multiplier: "1", amount: "3000000", total: "3000000" },
    { description: "Shift", multiplier: "20", amount: "75000", total: "1500000" },
]

function salary(employeeID, month) {
    return {
        components: salaryComponents,
        totalWithoutDebt: "4500000",
        total: "4500000",
        extraInfos: [{ id: 1, employeeID, month, title: "Catatan", description: "Data stub", createdAt: iso(now) }],
    }
}

const salarySnapshots = [1, 2].map((id) => ({
    id,
    employeeID: id,
    month: currentMonth,
    salary: salary(id, currentMonth),
    createdAt: iso(daysAgo(id)),
}))

const rejectedDrugs = [1, 2].map((id) => ({
    id,
    createdAt: iso(daysAgo(id)),
    updatedAt: iso(daysAgo(id)),
    drugName: `Obat ditolak ${id}`,
    resolution: id === 1 ? "UNRESOLVED" : "ORDERED",
    resolutionNotes: "",
    createdBy: "staff@example.com",
}))

const rejectedDrugForm = (d) => ({
    title: d ? "Ubah obat ditolak" : "Tambah obat ditolak",
    fields: [{ id: "drugName", label: "Nama obat", type: "TEXT", value: d?.drugName, required: true }],
})

const salesStatistics = () => {
    const history = []
    for (let h = 8; h >= 0; h--) {
        history.push({ pulledAt: iso(new Date(now.getTime() - h * 3600_000)), totalSales: 250000 * (9 - h), numberOfSales: 5 * (9 - h) })
    }
    return { history, dailyHistory: history }
}

const stockChange = { batchCode: "B001", initialQuantity: 10, realQuantity: 9 }
const stockOpname = {
    drugCode: "PCT500",
    drugName: "Paracetamol 500 mg",
    unit: "Strip",
    changes: [stockChange],
    quantityDifference: -1,
    hppDifference: -4500,
    salePriceDifference: -5500,
}

const suppliers = [
    {
        vmedisId: 1, code: "SS", name: "PT Sumber Sehat", address: "Jl. Merdeka 1", city: "Bandung",
        phone: "022-123", mobilePhone: "0812", bankAccountNumber: "123", taxNumber: "01.234",
        active: true, leadTimeDays: 2, rating: 4, updatedAt: iso(daysAgo(3)),
    },
]

// ---------------------------------------------------------------------------
// Routes: [method, path regex (after /vmedis/api or /hris/api), handler]
// ---------------------------------------------------------------------------

const vmedis = [
    ["POST", /^\/v1\/users\/login$/, (_m, body) => ({ email: body?.email ?? "admin@example.com", role: "admin" })],
    ["GET", /^\/v1\/drugs$/, () => ({ drugs: drugsV1 })],
    ["GET", /^\/v2\/drugs$/, () => ({ drugs: drugsV2 })],
    ["GET", /^\/v1\/drugs\/to-stock-opname\/?$/, () => ({ drugs: drugsV1 })],
    ["GET", /^\/v1\/sales\/statistics$/, salesStatistics],
    ["GET", /^\/v1\/sales\/drugs$/, () => ({ drugs: drugsV1.map((drug, i) => ({ drug, occurrences: 3 + i, totalAmount: 50000 * (i + 1) })) })],
    ["GET", /^\/v2\/sales\/drugs\/[^/]+\/last$/, () => table(["Tanggal", "Jumlah", "Harga"], [[ymd(daysAgo(1)), "2 Strip", "Rp 11.000"]])],
    ["GET", /^\/v2\/procurements\/drugs\/[^/]+\/last$/, () => table(["Tanggal", "Supplier", "Jumlah"], [[ymd(daysAgo(7)), "PT Sumber Sehat", "5 Box"]])],
    ["GET", /^\/v2\/procurements\/suppliers\/recap$/, () => table(["Supplier", "Jumlah faktur", "Total"], [["PT Sumber Sehat", "3", "Rp 1.500.000"]])],
    ["GET", /^\/v1\/procurements\/recommendations$/, () => ({
        recommendations: drugsV1.map((drug) => ({ drug, stock: drug.stocks.join(", "), fromSupplier: drug.supplier, procurement: "2 Box", alternatives: [] })),
        computedAt: iso(now),
    })],
    ["GET", /^\/v1\/procurements\/recommendations\/status$/, () => ({ status: "IDLE" })],
    ["POST", /^\/v1\/procurements\/recommendations\/dump$/, () => ({ message: "ok" })],
    ["GET", /^\/v1\/procurements\/invoice-calculators$/, () => ({
        calculators: [
            { supplier: "PT Sumber Sehat", shouldRound: true, components: [{ name: "Subtotal", multiplier: 1 }, { name: "PPN", multiplier: 0.11 }] },
            { supplier: "PT Medika Jaya", shouldRound: false, components: [{ name: "Subtotal", multiplier: 1 }] },
        ],
    })],
    ["GET", /^\/v1\/stock-opnames$/, () => ({ stockOpnames: [{ vmedisId: "1", batchCode: "B001", initialQuantity: 10, realQuantity: 9, notes: "", ...stockOpname }] })],
    ["GET", /^\/v1\/stock-opnames\/compacted$/, () => ({ stockOpnames: [{ date: ymd(daysAgo(1)), ...stockOpname }] })],
    ["GET", /^\/v1\/stock-opnames\/summaries$/, () => ({ summaries: [stockOpname] })],
    ["GET", /^\/v1\/suppliers$/, () => ({ suppliers })],
    ["GET", /^\/v1\/suppliers\/dump\/status$/, () => ({ status: "IDLE" })],
    ["GET", /^\/v2\/shifts$/, () => table(["Kode", "Kasir", "Mulai", "Selesai"], [["S1", "Andi", iso(daysAgo(1)), iso(now)]])],
    ["GET", /^\/v2\/shifts\/(\d+)\/show$/, (m) => html(`<h1>Shift ${m[1]}</h1><p>Stub shift printout.</p>`)],
    ["GET", /^\/v2\/shifts\/dump\/status$/, () => ({ status: "IDLE" })],
    ["GET", /^\/v2\/vmedis\/tokens$/, () => table(["ID", "Token", "Status"], [["1", "abc…", "ACTIVE"]])],
    ["GET", /^\/v2\/vmedis\/tokens\/refresh\/status$/, () => ({ status: "IDLE" })],
    ["GET", /^\/v2\/rejected-drugs$/, () => table(["Obat", "Status", "Dibuat oleh"], rejectedDrugs.map((d) => [d.drugName, d.resolution, d.createdBy]))],
    ["GET", /^\/v2\/rejected-drugs\/resolutions$/, () => ({ options: [{ value: "UNRESOLVED", label: "Belum ditangani" }, { value: "ORDERED", label: "Sudah dipesan" }] })],
    ["GET", /^\/v2\/rejected-drugs\/form$/, () => rejectedDrugForm()],
    ["GET", /^\/v2\/rejected-drugs\/(\d+)$/, (m) => {
        const d = rejectedDrugs.find((d) => d.id === Number(m[1])) ?? rejectedDrugs[0]
        return table(undefined, [["Nama obat", d.drugName], ["Resolusi", d.resolution], ["Dibuat oleh", d.createdBy], ["Dibuat pada", d.createdAt]])
    }],
    ["GET", /^\/v2\/rejected-drugs\/(\d+)\/form$/, (m) => rejectedDrugForm(rejectedDrugs.find((d) => d.id === Number(m[1])))],
]

const hris = [
    ["GET", /^\/v1\/employees$/, () => employees],
    ["GET", /^\/v1\/employees\/(\d+)$/, (m) => employees.find((e) => e.id === Number(m[1])) ?? employees[0]],
    ["GET", /^\/v1\/work-types$/, () => workTypes],
    ["GET", /^\/v1\/work-logs$/, () => workLogs],
    ["GET", /^\/v1\/work-logs\/(\d+)\/for-patient$/, (m) => html(`<h1>Laporan pekerjaan ${m[1]}</h1><p>Stub patient printout.</p>`)],
    ["GET", /^\/v1\/attendances$/, (_m, _b, q) => attendancesForMonth(q.get("month") ?? currentMonth)],
    ["GET", /^\/v1\/attendances\/types$/, () => attendanceTypes],
    ["GET", /^\/v1\/attendances\/quotas$/, () => attendanceTypes.filter((t) => t.hasQuota).map((t) => ({
        attendanceType: t,
        quotas: employees.map((e) => ({ id: e.id, employeeID: e.id, attendanceType: t, remainingQuota: 12, createdAt: iso(daysAgo(30)), updatedAt: iso(now) })),
    }))],
    ["GET", /^\/v1\/attendances\/quotas\/audit-logs$/, () => [
        { id: 1, employeeID: 1, attendanceType: attendanceTypes[1], previousQuota: 12, newQuota: 11, reason: "attendance_deduction", createdAt: iso(daysAgo(2)) },
    ]],
    ["GET", /^\/v1\/salary\/snapshots$/, () => salarySnapshots],
    ["GET", /^\/v1\/salary\/snapshots\/(\d+)$/, (m) => salarySnapshots.find((s) => s.id === Number(m[1])) ?? salarySnapshots[0]],
    ["GET", /^\/v1\/salary\/(\d+)\/static-components$/, (m) => salaryComponents.map((c, i) => ({ id: i + 1, employeeID: Number(m[1]), ...c }))],
    ["GET", /^\/v1\/salary\/(\d{4}-\d{2})\/(\d+)\/additional-components$/, (m) => [
        { id: 1, employeeID: Number(m[2]), month: m[1], description: "Bonus", amount: "100000", multiplier: "1", total: "100000" },
    ]],
    ["GET", /^\/v1\/salary\/(\d{4}-\d{2})\/(\d+)\/extra-infos$/, (m) => salary(Number(m[2]), m[1]).extraInfos],
    ["GET", /^\/v1\/salary\/(\d{4}-\d{2})\/(\d+)$/, (m) => salary(Number(m[2]), m[1])],
]

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

function readBody(req) {
    return new Promise((resolve) => {
        let data = ""
        req.on("data", (chunk) => (data += chunk))
        req.on("end", () => {
            try {
                resolve(data ? JSON.parse(data) : null)
            } catch {
                resolve(null)
            }
        })
    })
}

function send(res, status, body) {
    res.writeHead(status, { "Content-Type": "application/json" })
    res.end(body === undefined ? "" : JSON.stringify(body))
}

const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://stub")
    const match = url.pathname.match(/^\/(vmedis|hris)\/api(\/.*)$/)
    const body = await readBody(req)

    if (match) {
        const [, service, path] = match
        const routes = service === "vmedis" ? vmedis : hris

        for (const [method, pattern, handler] of routes) {
            const m = path.match(pattern)
            if (m && method === req.method) {
                console.log(`200 ${req.method} ${url.pathname}${url.search}`)
                const result = handler(m, body, url.searchParams)
                if (result?.[HTML]) {
                    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
                    return res.end(result[HTML])
                }
                return send(res, 200, result)
            }
        }

        // Accept writes so mutations in the UI don't error out.
        if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
            console.log(`200 ${req.method} ${url.pathname} (echo)`)
            return send(res, 200, { id: 999, message: "ok", ...(body ?? {}) })
        }
    }

    console.warn(`404 ${req.method} ${url.pathname}${url.search}`)
    send(res, 404, { message: "No stub for this route" })
})

server.listen(PORT, "127.0.0.1", () => {
    console.log(`Stub API listening on http://127.0.0.1:${PORT}`)
    console.log(`  VMEDIS_PROXY_URL=http://127.0.0.1:${PORT}/vmedis/api`)
    console.log(`  HRIS_PROXY_URL=http://127.0.0.1:${PORT}/hris/api`)
})
