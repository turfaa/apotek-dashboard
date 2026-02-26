"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
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
import { Switch } from "@/components/ui/switch"
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
    hasQuota: z.boolean(),
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
            hasQuota: false,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await createAttendanceType(
                {
                    name: values.name,
                    payableType: values.payableType,
                    hasQuota: values.hasQuota,
                },
                session,
            )
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
                                <Input
                                    placeholder="Masukkan nama jenis kehadiran"
                                    {...field}
                                />
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
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe pembayaran" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={PayableType.Working}>
                                        Kerja
                                    </SelectItem>
                                    <SelectItem value={PayableType.Benefit}>
                                        Tunjangan
                                    </SelectItem>
                                    <SelectItem value={PayableType.None}>
                                        Tidak Ada
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="hasQuota"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Kuota
                                </FormLabel>
                                <FormDescription>
                                    Aktifkan jika jenis kehadiran ini memiliki
                                    batasan kuota per karyawan.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
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
