"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createWorkType } from "@/lib/api/work"
import { toast } from "sonner"
import { Session } from "next-auth"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    outcomeUnit: z.string().min(1, {
        message: "Satuan hasil harus diisi.",
    }),
    multiplier: z.number().positive({
        message: "Pengali gaji harus berupa angka positif.",
    }),
    notes: z.string().optional(),
})

interface WorkTypeFormProps {
    session: Session | null
}

export function WorkTypeForm({ session }: WorkTypeFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            outcomeUnit: "",
            multiplier: 1,
            notes: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createWorkType({
                name: values.name,
                outcomeUnit: values.outcomeUnit,
                multiplier: values.multiplier,
                notes: values.notes || "",
            }, session)
            toast.success("Jenis pekerjaan berhasil ditambahkan")
            router.push("/works/types")
            router.refresh()
        } catch (error) {
            toast.error("Gagal menambahkan jenis pekerjaan")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                                <Input placeholder="Masukkan nama" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="outcomeUnit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Satuan Hasil</FormLabel>
                            <FormControl>
                                <Input placeholder="Contoh: pasien, resep, dll" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="multiplier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pengali Gaji</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="1"
                                    {...field}
                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catatan</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Masukkan catatan tambahan (opsional)"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button type="submit">Tambah Jenis Pekerjaan</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/works/types")}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </Form>
    )
} 