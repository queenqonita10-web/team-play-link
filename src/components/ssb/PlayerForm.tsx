import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { calculateAge, getAgeCategory } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import type { Player, Position } from "@/types";

const positions: Position[] = ["GK", "CB", "LB", "RB", "CM", "LM", "RM", "CAM", "LW", "RW", "ST"];

const playerSchema = z.object({
  name: z.string().trim().min(2, "Minimal 2 karakter").max(100),
  nik: z.string().regex(/^\d{16}$/, "NIK harus 16 digit angka"),
  dateOfBirth: z.string().min(1, "Wajib diisi"),
  position: z.enum(["GK", "CB", "LB", "RB", "CM", "LM", "RM", "CAM", "LW", "RW", "ST"]),
  parentName: z.string().trim().min(2, "Minimal 2 karakter"),
  motherName: z.string().trim().min(2, "Minimal 2 karakter"),
  parentPhone: z.string().regex(/^\d*$/, "Hanya angka").optional().or(z.literal("")),
  parentEmail: z.string().email("Email tidak valid").optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
});

type FormErrors = Partial<Record<keyof z.infer<typeof playerSchema>, string>>;

interface PlayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (player: Player) => void;
}

export function PlayerForm({ open, onOpenChange, onSubmit }: PlayerFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState<Position>("ST");
  const [parentName, setParentName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const age = dob ? calculateAge(dob) : null;
  const category = dob ? getAgeCategory(dob) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = playerSchema.safeParse({ name, nik, dateOfBirth: dob, position, parentName, motherName, parentPhone, parentEmail, address });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const player: Player = {
      id: `p-${Date.now()}`,
      name: result.data.name,
      nik: result.data.nik,
      dateOfBirth: result.data.dateOfBirth,
      ageCategory: category!,
      position: result.data.position,
      parentName: result.data.parentName,
      motherName: result.data.motherName,
      parentPhone: result.data.parentPhone || "",
      parentEmail: result.data.parentEmail || "",
      address: result.data.address || "",
      ssbId: "ssb1",
      status: "active",
      documents: {},
      developmentNotes: [],
    };

    onSubmit(player);
    resetForm();
  };

  const resetForm = () => {
    setName(""); setNik(""); setDob(""); setPosition("ST"); setParentName("");
    setMotherName(""); setParentPhone(""); setParentEmail(""); setAddress("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.ssb.addPlayer}</DialogTitle>
          <DialogDescription>{t.ssb.playerDetail}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t.ssb.playerName} *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.nik} *</Label>
            <Input value={nik} onChange={(e) => setNik(e.target.value)} maxLength={16} placeholder="16 digit" />
            {errors.nik && <p className="text-xs text-destructive">{errors.nik}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.dateOfBirth} *</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            {age !== null && category && (
              <div className="flex gap-2">
                <Badge variant="outline">{age} {t.ssb.years}</Badge>
                <Badge variant="secondary">{category}</Badge>
              </div>
            )}
            {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.position}</Label>
            <Select value={position} onValueChange={(v) => setPosition(v as Position)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {positions.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.parentName} *</Label>
            <Input value={parentName} onChange={(e) => setParentName(e.target.value)} />
            {errors.parentName && <p className="text-xs text-destructive">{errors.parentName}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.motherName} *</Label>
            <Input value={motherName} onChange={(e) => setMotherName(e.target.value)} />
            {errors.motherName && <p className="text-xs text-destructive">{errors.motherName}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.parentPhone}</Label>
            <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
            {errors.parentPhone && <p className="text-xs text-destructive">{errors.parentPhone}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.parentEmail}</Label>
            <Input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
            {errors.parentEmail && <p className="text-xs text-destructive">{errors.parentEmail}</p>}
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.address}</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t.common.cancel}</Button>
            <Button type="submit">{t.common.save}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
