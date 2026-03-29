import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockPlayers } from "@/data/mock";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { PlayerForm } from "@/components/ssb/PlayerForm";
import type { AgeCategory, Player, PlayerStatus } from "@/types";

export default function Players() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState<AgeCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PlayerStatus | "all">("all");
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [showForm, setShowForm] = useState(false);

  const filtered = players.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchAge = ageFilter === "all" || p.ageCategory === ageFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchAge && matchStatus;
  });

  const ages: AgeCategory[] = ["U8", "U10", "U12", "U14", "U17"];

  const handleAddPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.ssb.playerList}</h1>
        <Button size="sm" className="gap-1.5" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />{t.ssb.addPlayer}
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t.common.search} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={ageFilter} onValueChange={(v) => setAgeFilter(v as AgeCategory | "all")}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.total}</SelectItem>
            {ages.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PlayerStatus | "all")}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.total}</SelectItem>
            <SelectItem value="active">{t.ssb.active}</SelectItem>
            <SelectItem value="inactive">{t.ssb.inactive}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filtered.map((p) => (
          <Card
            key={p.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/ssb/players/${p.id}`)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">{p.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">
                  {p.position} · {calculateAge(p.dateOfBirth)} {t.ssb.years} · {t.ssb.motherName}: {p.motherName}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={p.status === "active" ? "default" : "secondary"}>
                  {p.status === "active" ? t.ssb.active : t.ssb.inactive}
                </Badge>
                <Badge variant="outline">{p.ageCategory}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t.common.noData}</p>}
      </div>

      <PlayerForm open={showForm} onOpenChange={setShowForm} onSubmit={handleAddPlayer} />
    </div>
  );
}
