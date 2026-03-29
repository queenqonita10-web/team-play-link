import { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockPlayers } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import type { AgeCategory } from "@/types";

export default function Players() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [ageFilter, setAgeFilter] = useState<AgeCategory | "all">("all");

  const filtered = mockPlayers.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchAge = ageFilter === "all" || p.ageCategory === ageFilter;
    return matchSearch && matchAge;
  });

  const ages: AgeCategory[] = ["U8", "U10", "U12", "U14", "U17"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.ssb.playerList}</h1>
        <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t.ssb.addPlayer}</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t.common.search} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={ageFilter} onValueChange={(v) => setAgeFilter(v as any)}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.total}</SelectItem>
            {ages.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-3">
        {filtered.map((p) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">{p.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.position} · {t.ssb.parentName}: {p.parentName}</div>
              </div>
              <Badge variant="secondary">{p.ageCategory}</Badge>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t.common.noData}</p>}
      </div>
    </div>
  );
}
