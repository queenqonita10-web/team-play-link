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
import type { Player, Position } from "@/types";

const positions: Position[] = ["GK", "CB", "LB", "RB", "CM", "LM", "RM", "CAM", "LW", "RW", "ST"];

interface PlayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (player: Player) => void;
}

export function PlayerForm({ open, onOpenChange, onSubmit }: PlayerFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [position, setPosition] = useState<Position>("ST");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [address, setAddress] = useState("");

  const age = dob ? calculateAge(dob) : null;
  const category = dob ? getAgeCategory(dob) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob || !parentName) return;

    const player: Player = {
      id: `p-${Date.now()}`,
      name,
      dateOfBirth: dob,
      ageCategory: category!,
      position,
      parentName,
      parentPhone,
      parentEmail,
      address,
      ssbId: "ssb1",
      status: "active",
      documents: {},
      developmentNotes: [],
    };

    onSubmit(player);
    resetForm();
  };

  const resetForm = () => {
    setName(""); setDob(""); setPosition("ST"); setParentName("");
    setParentPhone(""); setParentEmail(""); setAddress("");
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
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.dateOfBirth} *</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            {age !== null && category && (
              <div className="flex gap-2">
                <Badge variant="outline">{age} {t.ssb.years}</Badge>
                <Badge variant="secondary">{category}</Badge>
              </div>
            )}
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
            <Input value={parentName} onChange={(e) => setParentName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.parentPhone}</Label>
            <Input value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>{t.ssb.parentEmail}</Label>
            <Input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
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
