"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
    CreatePurchaseOrderLetterRequest,
    CreatePurchaseOrderLetterResponse,
    PurchaseOrderLetterError,
    createPurchaseOrderLetter,
    downloadPurchaseOrderLetterPdf,
} from "@/lib/api/purchase-order-letter"

export const historyPath = "/procurements/purchase-orders"

export interface CreateErrorMessage {
    title: string
    description: string
}

// Explains a failed create in the dialog. The dialog keeps the operator's
// choices, so every message ends in "try again".
export function describeCreateError(error: unknown): CreateErrorMessage {
    const title = "Gagal membuat surat pesanan"

    if (error instanceof PurchaseOrderLetterError) {
        switch (error.status) {
            case 400:
                return { title, description: `${error.message}.` }
            case 404:
                return {
                    title,
                    description:
                        "Supplier atau template tidak ditemukan. Sinkronkan data supplier di Daftar Supplier, lalu coba lagi.",
                }
            case 503:
                return {
                    title,
                    description:
                        "Surat pesanan belum dikonfigurasi di server. Hubungi admin.",
                }
        }

        if (error.status >= 500) {
            return {
                title,
                description: `Terjadi kesalahan di server (${error.status}). Pilihan Anda tidak hilang, silakan coba lagi.`,
            }
        }

        return { title, description: error.message }
    }

    return {
        title,
        description:
            "Server tidak dapat dihubungi. Pilihan Anda tidak hilang, silakan coba lagi.",
    }
}

// Downloads an SP's PDF, with a toast when it fails.
export async function downloadWithToast(id: number, number: string): Promise<void> {
    try {
        await downloadPurchaseOrderLetterPdf(id)
    } catch {
        toast.error(`Gagal mengunduh PDF surat pesanan ${number}`, {
            description: "Coba unduh lagi dari Riwayat Surat Pesanan.",
        })
    }
}

export interface CreateAndDownloadOptions {
    // Whether the success toast links to Riwayat (not needed on Riwayat).
    showHistoryLink?: boolean
}

// Creates an SP, then downloads its PDF and shows the success toast. Throws
// when the create fails, so the dialog can show the error and keep its state.
// Creating and downloading are separate requests, so a failed download never
// uses a number up: the SP can be downloaded again from Riwayat.
export function useCreateAndDownload(): (
    request: CreatePurchaseOrderLetterRequest,
    options?: CreateAndDownloadOptions,
) => Promise<CreatePurchaseOrderLetterResponse> {
    const router = useRouter()

    return async (request, options) => {
        const created = await createPurchaseOrderLetter(request)

        toast.success(`Surat pesanan ${created.number} dibuat`, {
            description: `Dibuat oleh ${request.createdByEmployee.name}. PDF sedang diunduh.`,
            action:
                (options?.showHistoryLink ?? true)
                    ? {
                        label: "Lihat riwayat",
                        onClick: () => router.push(historyPath),
                    }
                    : undefined,
        })

        void downloadWithToast(created.id, created.number)

        return created
    }
}
