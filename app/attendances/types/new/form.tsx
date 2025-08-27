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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createAttendanceType, PayableType } from "@/lib/api/attendance"
import { toast } from "sonner"
import { Session } from "next-auth"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter.",
    }),
    payableType: z.nativeEnum(PayableType, {
        message: "Tipe pembayaran harus dipilih.",
    }),
})

interface AttendanceTypeFormProps {
    session: Session | null
}

export function AttendanceTypeForm({ session }: AttendanceTypeFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            payableType: PayableType.Working,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createAttendanceType({
                name: values.name,
                payableType: values.payableType,
            }, session)
            toast.success("Jenis kehadiran berhasil ditambahkan")
            router.push("/attendances/types")
            router.refresh()
        } catch (error) {
            toast.error("Gagal menambahkan jenis kehadiran")
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
                                <Input placeholder="Masukkan nama jenis kehadiran" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="payableType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipe Pembayaran</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe pembayaran" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={PayableType.Working}>Kerja</SelectItem>
                                    <SelectItem value={PayableType.Benefit}>Tunjangan</SelectItem>
                                    <SelectItem value={PayableType.None}>Tidak Ada</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <Button type="submit">Tambah Jenis Kehadiran</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/attendances/types")}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </Form>
    )
}
