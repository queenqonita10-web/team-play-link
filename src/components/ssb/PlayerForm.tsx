import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Player, 
  Position, 
  AgeCategory, 
  PlayerStatus,
  VerificationStatus
} from "@/types";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Users, 
  FileUp, 
  Save, 
  X,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  Shield,
  MapPin
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getAgeCategory, calculateAge } from "@/lib/player-utils";

const playerSchema = z.object({
  name: z.string().min(3, "Minimal 3 karakter").max(100, "Maksimal 100 karakter"),
  nik: z.string().length(16, "NIK harus 16 digit").regex(/^\d+$/, "NIK harus angka"),
  dateOfBirth: z.string().min(1, "Tanggal lahir wajib diisi"),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  phone: z.string().min(10, "Nomor telepon tidak valid").optional().or(z.literal("")),
  position: z.enum(["goalkeeper", "defender", "midfielder", "forward"]),
  status: z.enum(["active", "inactive"]),
  address: z.string().min(5, "Alamat terlalu pendek"),
  parent: z.object({
    motherName: z.string().min(3, "Nama ibu wajib diisi"),
    contactNumber: z.string().min(10, "Nomor kontak tidak valid"),
    relationshipType: z.string().default("Mother"),
    email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  }),
});

interface PlayerFormProps {
  initialData?: Player | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PlayerForm({ initialData, onSubmit, onCancel }: PlayerFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState("personal");
  
  const form = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      nik: initialData.nik,
      dateOfBirth: initialData.dateOfBirth,
      email: initialData.email || "",
      phone: initialData.phone || "",
      position: initialData.position,
      status: initialData.status,
      address: initialData.address,
      parent: {
        motherName: initialData.parent.motherName,
        contactNumber: initialData.parent.contactNumber,
        relationshipType: initialData.parent.relationshipType,
        email: initialData.parent.email || "",
      },
    } : {
      name: "",
      nik: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      position: "midfielder",
      status: "active",
      address: "",
      parent: {
        motherName: "",
        contactNumber: "",
        relationshipType: "Mother",
        email: "",
      },
    },
  });

  const dob = form.watch("dateOfBirth");
  const age = dob ? calculateAge(dob) : 0;
  const ageCat = dob ? getAgeCategory(dob) : "-";

  const handleFormSubmit = (values: z.infer<typeof playerSchema>) => {
    // Check age constraints (6-25)
    if (age < 6 || age > 25) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Umur pemain harus antara 6 hingga 25 tahun.",
      });
      return;
    }

    const submissionData = {
      ...values,
      age,
      ageCategory: ageCat,
      updatedAt: new Date().toISOString(),
    };

    onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" /> Data Diri
            </TabsTrigger>
            <TabsTrigger value="parent" className="gap-2">
              <Users className="h-4 w-4" /> Orang Tua
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileUp className="h-4 w-4" /> Dokumen
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Informasi Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Ahmad Rizki" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIK (16 Digit)</FormLabel>
                        <FormControl>
                          <Input placeholder="3201..." maxLength={16} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Lahir</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          {dob && (
                            <span className="text-xs font-medium text-primary">
                              Umur: {age} Thn · Kategori: {ageCat}
                            </span>
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posisi Bermain</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih posisi" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                            <SelectItem value="defender">Defender</SelectItem>
                            <SelectItem value="midfielder">Midfielder</SelectItem>
                            <SelectItem value="forward">Forward</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Pemain (Opsional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="email@pemain.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Telepon (Opsional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="0812..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status Keanggotaan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Nonaktif</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Alamat Lengkap</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Jl. Raya No..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parent" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Data Orang Tua / Wali</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parent.motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Ibu Kandung</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama lengkap ibu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parent.contactNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor WA / Telepon</FormLabel>
                        <FormControl>
                          <Input placeholder="0812..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parent.email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email Orang Tua</FormLabel>
                        <FormControl>
                          <Input placeholder="email@orangtua.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold">Upload Dokumen Pendukung</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-center">Akte Kelahiran (PDF/JPG)</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Max 5MB</span>
                    </div>
                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-center">Kartu Keluarga (PDF/JPG)</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Max 5MB</span>
                    </div>
                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-all cursor-pointer">
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs font-bold text-center">Foto Profil (JPG/PNG)</span>
                      <span className="text-[10px] text-muted-foreground mt-1">Max 5MB</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Seluruh dokumen yang diunggah akan disimpan dengan enkripsi dan hanya digunakan untuk keperluan verifikasi identitas pemain oleh pihak berwenang.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
            <X className="h-4 w-4" /> Batal
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" /> {initialData ? "Simpan Perubahan" : "Daftarkan Pemain"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
