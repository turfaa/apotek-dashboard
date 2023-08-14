import {create} from "zustand"

export interface PrintModeHook {
    isPrintMode: boolean
    setPrintMode: (isPrintMode: boolean) => void
}

export const usePrintMode = create<PrintModeHook>(set => ({
    isPrintMode: false,
    setPrintMode: (isPrintMode: boolean) => set({isPrintMode}),
}))
