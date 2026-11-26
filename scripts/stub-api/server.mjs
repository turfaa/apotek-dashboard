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
import { crc32 } from "node:zlib"

const PORT = Number(process.env.STUB_API_PORT ?? 4010)

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const now = new Date()
const iso = (d) => d.toISOString()
const ymd = (d) => d.toLocaleDateString("en-CA")
const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000)
const currentMonth = ymd(now).slice(0, 7)

// Handlers return JSON by default; wrap HTML endpoints with html(), and any
// other response (a status, headers or a binary body) with raw().
const html = (body) => ({ [HTML]: `<!doctype html><html><body>${body}</body></html>` })
const HTML = Symbol("html")
const raw = (status, headers, body) => ({ [RAW]: { status, headers, body } })
const RAW = Symbol("raw")

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
    {
        // No supplier, so its recommendation has no fromSupplier.
        vmedisCode: "MNY60",
        name: "Minyak Kayu Putih 60 ml",
        manufacturer: "Cap Lang",
        supplier: "",
        minimumStock: "2 Botol",
        units: [
            { unit: "Botol", unitOrder: 1, priceOne: 25000, priceTwo: 24000, priceThree: 23000 },
        ],
        stocks: ["1 Botol"],
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
    { id: 1, name: "Andi", shiftFee: "75000", showInAttendances: true, isActive: true },
    { id: 2, name: "Budi", shiftFee: "70000", showInAttendances: true, isActive: true },
    { id: 3, name: "Citra", shiftFee: "80000", showInAttendances: false, isActive: true },
    { id: 4, name: "Dewi", shiftFee: "72000", showInAttendances: true, isActive: false },
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
    {
        // No address, to show the "Alamat supplier kosong" warning.
        vmedisId: 2, code: "MJ", name: "PT Medika Jaya", address: "", city: "",
        phone: "", mobilePhone: "", bankAccountNumber: "", taxNumber: "",
        active: true, leadTimeDays: 3, rating: 3, updatedAt: iso(daysAgo(3)),
    },
]

// Purchase order letters (surat pesanan). Kept in memory, so SPs created
// while clicking through show up in Riwayat until the stub restarts.
const purchaseOrderOptions = {
    templates: [
        { id: "reguler", name: "Surat Pesanan Reguler", description: "Untuk obat bebas, bebas terbatas, keras dan alat kesehatan.", itemFields: "basic", signatureMode: "optional" },
        { id: "prekursor", name: "Surat Pesanan Prekursor Farmasi", description: "Untuk obat mengandung prekursor farmasi. Dibuat terpisah dari obat lain.", itemFields: "controlled", signatureMode: "wet" },
        { id: "oot", name: "Surat Pesanan Obat-Obat Tertentu", description: "Untuk Obat-Obat Tertentu yang sering disalahgunakan. Dibuat terpisah dari obat lain.", itemFields: "controlled", signatureMode: "wet" },
    ],
    signer: { name: "Nama Apoteker", licenseNumber: "SIPA-0000" },
    vmedisSupplierPageUrl: "https://aulia.vmedis.com/apt-data-supplier-v2",
    vmedisDrugPageUrl: "https://aulia.vmedis.com/apt-obat-batch-v2",
}
const templateNumberCodes = { reguler: "REG", prekursor: "PRE", oot: "OOT" }
const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]
const purchaseOrders = []

// What Vmedis has on each drug for the Prekursor/OOT fields. AMX500 starts
// incomplete, and "Muat ulang dari Vmedis" fills it, as if it was filled in
// Vmedis meanwhile. PCT500's golongan is another class, to show the warning.
const drugVmedisDetails = {
    PCT500: { golongan: "Obat Bebas", activeIngredient: "Paracetamol", dosageFormStrength: "Tablet 500 mg" },
    AMX500: { golongan: "", activeIngredient: null, dosageFormStrength: null },
    MNY60: { golongan: "DEPAN", activeIngredient: "Oleum Cajuputi", dosageFormStrength: "Cairan 60 ml" },
}
const drugVmedisDetailsInVmedis = {
    ...drugVmedisDetails,
    AMX500: { golongan: "Obat-Obatan Tertentu", activeIngredient: "Amoksisilin", dosageFormStrength: "Kapsul 500 mg" },
}
const golonganClasses = { prekursor: "prekursor", "obat-obatan tertentu": "oot", "obat bebas": "other", "obat keras": "other" }

function itemDetails(templateId, codes) {
    const template = purchaseOrderOptions.templates.find((t) => t.id === templateId)
    if (!template) return raw(400, {}, { error: `template "${templateId}" tidak dikenal` })

    return {
        items: [...new Set(codes.map((c) => c.trim()).filter(Boolean))].map((code) => {
            const drug = drugsV1.find((d) => d.vmedisCode === code)
            const details = drugVmedisDetails[code]
            const cls = details && golonganClasses[details.golongan.toLowerCase()]
            return {
                drugVmedisCode: code,
                found: !!drug,
                activeIngredient: details?.activeIngredient ?? null,
                dosageFormStrength: details?.dosageFormStrength ?? null,
                units: (drug?.units ?? []).map((u) => ({ unit: u.unit, parentUnit: u.parentUnit ?? "", conversionToParentUnit: u.conversionToParentUnit ?? 0 })),
                vmedisGolongan: details?.golongan || null,
                classMatches: template.itemFields === "controlled" && cls ? cls === templateId : null,
                missingInVmedis: [
                    ...(details?.activeIngredient ? [] : ["activeIngredient"]),
                    ...(details?.dosageFormStrength ? [] : ["dosageFormStrength"]),
                ],
            }
        }),
    }
}

function refreshItemDetails(body) {
    for (const code of body?.codes ?? []) {
        if (drugVmedisDetailsInVmedis[code]) drugVmedisDetails[code] = drugVmedisDetailsInVmedis[code]
    }
    return itemDetails(body?.templateId, body?.codes ?? [])
}

const terbilangDigits = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]
// Enough of terbilang for the stub: up to 999.
function stubTerbilang(n) {
    const words = []
    const hundreds = Math.floor(n / 100)
    if (hundreds) words.push(hundreds === 1 ? "seratus" : `${terbilangDigits[hundreds]} ratus`)
    n %= 100
    if (n && n < 12) words.push(terbilangDigits[n])
    else if (n && n < 20) words.push(`${terbilangDigits[n - 10]} belas`)
    else if (n) words.push(`${terbilangDigits[Math.floor(n / 10)]} puluh`, ...(n % 10 ? [terbilangDigits[n % 10]] : []))
    return words.join(" ") || "nol"
}

function cancelPurchaseOrder(m, body) {
    const po = purchaseOrders.find((p) => p.id === Number(m[1]))
    if (!po) return raw(404, {}, { error: "purchase order not found" })
    if (po.cancellation) return raw(409, {}, { error: "surat pesanan sudah dibatalkan" })
    if (!body?.reason?.trim()) return raw(400, {}, { error: "alasan pembatalan wajib diisi" })
    if (!body?.cancelledByEmployee?.id) return raw(400, {}, { error: "karyawan yang membatalkan wajib dipilih" })

    po.status = "cancelled"
    po.cancellation = {
        cancelledAt: iso(new Date()),
        reason: body.reason.trim(),
        cancelledByEmployee: body.cancelledByEmployee,
        cancelledByEmail: "stub@example.com",
    }
    return po
}

function createPurchaseOrder(body) {
    const earlier = body?.idempotencyKey && purchaseOrders.find((po) => po.idempotencyKey === body.idempotencyKey)
    if (earlier) return raw(200, {}, { id: earlier.id, number: earlier.number, createdAt: earlier.createdAt, replayed: true })

    if (!purchaseOrderOptions.templates.some((t) => t.id === body?.templateId)) return raw(400, {}, { error: `template "${body?.templateId}" tidak dikenal` })

    const supplier = suppliers.find((s) => s.vmedisId === body?.supplierVmedisId)
    if (!supplier) return raw(404, {}, { error: "supplier not found" })

    const invalidItems = (body.items ?? []).flatMap((item, i) => (item.drugName?.trim() && item.quantity?.trim() ? [] : [i]))
    if (!body.items?.length || invalidItems.length) return raw(400, {}, { error: `${invalidItems.length} obat belum diisi nama atau jumlahnya`, invalidItems })

    const template = purchaseOrderOptions.templates.find((t) => t.id === body.templateId)
    const controlled = template.itemFields === "controlled"
    if (controlled) {
        const incomplete = body.items.flatMap((item, i) => {
            const details = drugVmedisDetails[item.drugVmedisCode]
            return details?.activeIngredient && details?.dosageFormStrength ? [] : [i]
        })
        if (incomplete.length) return raw(400, {}, { error: `${incomplete.length} obat belum diisi zat aktif atau bentuk & kekuatannya di Data Obat Vmedis`, invalidItems: incomplete })

        const invalid = body.items.flatMap((item, i) => (/^\d+$/.test(item.quantity.trim()) && Number(item.quantity) >= 1 && item.smallestPackage?.trim() ? [] : [i]))
        if (invalid.length) return raw(400, {}, { error: `${invalid.length} obat tidak valid: jumlah harus angka bulat dan kemasan terkecil wajib diisi`, invalidItems: invalid })
    }

    const signed = !!body.includePharmacistSignature || template.signatureMode === "wet"
    const createdAt = new Date()
    const sameSeries = purchaseOrders.filter((po) => po.templateId === body.templateId && po.createdAt.slice(0, 7) === iso(createdAt).slice(0, 7))
    const number = `${String(sameSeries.length + 1).padStart(3, "0")}/SP-${templateNumberCodes[body.templateId]}/AAF/${romanMonths[createdAt.getMonth()]}/${createdAt.getFullYear()}`
    const po = {
        id: purchaseOrders.length + 1,
        number,
        templateId: body.templateId,
        templateName: template.name,
        templateItemFields: template.itemFields,
        status: "active",
        cancellation: null,
        supplier: { vmedisId: supplier.vmedisId, name: supplier.name, address: supplier.address, city: supplier.city, phone: supplier.phone },
        itemCount: body.items.length,
        includePharmacistSignature: signed,
        signer: signed ? purchaseOrderOptions.signer : null,
        createdByEmployee: body.createdByEmployee,
        createdByEmail: "stub@example.com",
        createdAt: iso(createdAt),
        idempotencyKey: body.idempotencyKey,
        items: body.items.map((item, i) => {
            const details = controlled ? drugVmedisDetails[item.drugVmedisCode] : undefined
            return {
                position: i + 1,
                drugVmedisCode: item.drugVmedisCode,
                drugName: item.drugName,
                quantity: controlled ? String(Number(item.quantity)) : item.quantity,
                activeIngredient: details?.activeIngredient ?? null,
                dosageFormStrength: details?.dosageFormStrength ?? null,
                smallestPackage: controlled ? item.smallestPackage.trim() : null,
                quantityWords: controlled ? stubTerbilang(Number(item.quantity)) : null,
                note: controlled ? item.note?.trim() || null : null,
            }
        }),
    }
    purchaseOrders.push(po)
    return raw(201, {}, { id: po.id, number: po.number, createdAt: po.createdAt, replayed: false })
}

function listPurchaseOrders(q) {
    const query = (q.get("q") ?? "").toLowerCase()
    const matches = purchaseOrders
        .filter((po) => !query || po.number.toLowerCase().includes(query) || po.items.some((item) => item.drugName.toLowerCase().includes(query)))
        .filter((po) => !q.get("supplierVmedisId") || po.supplier.vmedisId === Number(q.get("supplierVmedisId")))
        .filter((po) => !q.get("templateId") || po.templateId === q.get("templateId"))
        .filter((po) => !q.get("createdByEmployeeId") || po.createdByEmployee.id === Number(q.get("createdByEmployeeId")))
        .filter((po) => !q.get("status") || po.status === q.get("status"))
        .filter((po) => (!q.get("from") || ymd(new Date(po.createdAt)) >= q.get("from")) && (!q.get("to") || ymd(new Date(po.createdAt)) <= q.get("to")))
        .reverse()
    const page = Number(q.get("page") ?? 1)
    const pageSize = Number(q.get("pageSize") ?? 20)
    return {
        purchaseOrders: matches.slice((page - 1) * pageSize, page * pageSize).map(({ items: _items, signer: _signer, supplier, ...po }) => ({ ...po, supplier: { vmedisId: supplier.vmedisId, name: supplier.name } })),
        total: matches.length,
        page,
        pageSize,
    }
}

function purchaseOrderPdf(m) {
    const po = purchaseOrders.find((p) => p.id === Number(m[1]))
    if (!po) return raw(404, {}, { error: "purchase order not found" })

    const filename = `${po.createdAt.slice(0, 10)} - ${po.supplier.name} - ${po.templateName} - ${po.number.replaceAll("/", "-")}${po.cancellation ? " - DIBATALKAN" : ""}.pdf`
    return raw(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
    }, Buffer.from(tinyPdf(`Stub ${po.number}`)))
}

// Pay slips (slip gaji) of salary snapshots: a tiny PDF per snapshot, and a
// ZIP of a month's, named like HRIS names them.
function salarySlipFile(snapshot) {
    const name = employees.find((e) => e.id === snapshot.employeeID)?.name ?? `Karyawan #${snapshot.employeeID}`
    return { filename: `${snapshot.month} - ${name} - Slip Gaji.pdf`, content: Buffer.from(tinyPdf(`Stub Slip Gaji ${name}`)) }
}

function attachment(contentType, filename) {
    return {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-store",
    }
}

function salarySlipPdf(m) {
    const snapshot = salarySnapshots.find((s) => s.id === Number(m[1]))
    if (!snapshot) return raw(404, {}, { message: "snapshot not found" })

    const file = salarySlipFile(snapshot)
    return raw(200, attachment("application/pdf", file.filename), file.content)
}

function salarySlipsZip(_m, _body, params) {
    const month = params.get("month")
    if (!/^\d{4}-\d{2}$/.test(month ?? "")) return raw(400, {}, { message: "month is required" })

    const employeeID = params.get("employeeID")
    const snapshots = salarySnapshots.filter((s) =>
        s.month === month && (!employeeID || s.employeeID === Number(employeeID)))
    if (snapshots.length === 0) return raw(404, {}, { message: "no salary snapshots for this month" })

    return raw(200, attachment("application/zip", `${month} - Slip Gaji.zip`), storedZip(snapshots.map(salarySlipFile)))
}

// A ZIP of uncompressed ("stored") files.
function storedZip(files) {
    const locals = []
    const centrals = []
    let offset = 0

    for (const { filename, content } of files) {
        const name = Buffer.from(filename)
        const crc = crc32(content)

        const local = Buffer.alloc(30)
        local.writeUInt32LE(0x04034b50, 0)
        local.writeUInt16LE(20, 4)
        local.writeUInt16LE(0x0800, 6) // UTF-8 names
        local.writeUInt32LE(crc, 14)
        local.writeUInt32LE(content.length, 18)
        local.writeUInt32LE(content.length, 22)
        local.writeUInt16LE(name.length, 26)
        locals.push(local, name, content)

        const central = Buffer.alloc(46)
        central.writeUInt32LE(0x02014b50, 0)
        central.writeUInt16LE(20, 4)
        central.writeUInt16LE(20, 6)
        central.writeUInt16LE(0x0800, 8)
        central.writeUInt32LE(crc, 16)
        central.writeUInt32LE(content.length, 20)
        central.writeUInt32LE(content.length, 24)
        central.writeUInt16LE(name.length, 28)
        central.writeUInt32LE(offset, 42)
        centrals.push(central, name)

        offset += local.length + name.length + content.length
    }

    const centralSize = centrals.reduce((n, b) => n + b.length, 0)
    const end = Buffer.alloc(22)
    end.writeUInt32LE(0x06054b50, 0)
    end.writeUInt16LE(files.length, 8)
    end.writeUInt16LE(files.length, 10)
    end.writeUInt32LE(centralSize, 12)
    end.writeUInt32LE(offset, 16)

    return Buffer.concat([...locals, ...centrals, end])
}

// A one-page PDF with a line of text.
function tinyPdf(text) {
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
        null,
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    const stream = `BT /F1 18 Tf 72 770 Td (${text.replace(/[()\\]/g, "")}) Tj ET`
    objects[3] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`

    let pdf = "%PDF-1.4\n"
    const offsets = objects.map((obj, i) => {
        const offset = pdf.length
        pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
        return offset
    })
    const xref = pdf.length
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
    return pdf
}

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
        // Like the real API, fromSupplier is omitted when it is empty.
        recommendations: drugsV1.map((drug) => ({ drug, stock: drug.stocks.join(", "), ...(drug.supplier && { fromSupplier: drug.supplier }), procurement: "2 Box", alternatives: [] })),
        computedAt: iso(now),
    })],
    ["GET", /^\/v1\/procurements\/recommendations\/status$/, () => ({ status: "IDLE" })],
    ["POST", /^\/v1\/procurements\/recommendations\/dump$/, () => ({ message: "ok" })],
    ["GET", /^\/v1\/procurements\/purchase-orders\/options$/, () => purchaseOrderOptions],
    ["GET", /^\/v1\/procurements\/purchase-orders\/creators$/, () => ({
        creators: [...new Map(purchaseOrders.map((po) => [po.createdByEmployee.id, po.createdByEmployee])).values()],
    })],
    ["GET", /^\/v1\/procurements\/purchase-orders\/item-details$/, (_m, _b, q) => itemDetails(q.get("templateId"), (q.get("codes") ?? "").split(","))],
    ["POST", /^\/v1\/procurements\/purchase-orders\/item-details\/refresh$/, (_m, body) => refreshItemDetails(body)],
    ["POST", /^\/v1\/procurements\/purchase-orders\/(\d+)\/cancel$/, (m, body) => cancelPurchaseOrder(m, body)],
    ["GET", /^\/v1\/procurements\/purchase-orders$/, (_m, _b, q) => listPurchaseOrders(q)],
    ["POST", /^\/v1\/procurements\/purchase-orders$/, (_m, body) => createPurchaseOrder(body)],
    ["GET", /^\/v1\/procurements\/purchase-orders\/(\d+)$/, (m) => {
        const po = purchaseOrders.find((p) => p.id === Number(m[1]))
        return po ?? raw(404, {}, { error: "purchase order not found" })
    }],
    ["GET", /^\/v1\/procurements\/purchase-orders\/(\d+)\/pdf$/, purchaseOrderPdf],
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
    ["GET", /^\/v2\/vmedis\/tokens$/, () => table(["ID", "Token", "Status", "Versi"], [["1", "abc…", "ACTIVE", "V1"]])],
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
    ["GET", /^\/v1\/salary\/snapshots\/slips\.zip$/, salarySlipsZip],
    ["GET", /^\/v1\/salary\/snapshots\/(\d+)\/pdf$/, salarySlipPdf],
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
                const result = handler(m, body, url.searchParams)
                console.log(`${result?.[RAW]?.status ?? 200} ${req.method} ${url.pathname}${url.search}`)
                if (result?.[RAW]) {
                    const { status, headers, body: rawBody } = result[RAW]
                    if (Buffer.isBuffer(rawBody)) {
                        res.writeHead(status, headers)
                        return res.end(rawBody)
                    }
                    return send(res, status, rawBody)
                }
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
