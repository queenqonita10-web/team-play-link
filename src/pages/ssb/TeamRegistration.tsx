import * as React from "react";
import { 
  mockPlayers, 
  mockCompetitions, 
  mockCompetitionCategories 
} from "@/data/mock";
import { 
  Player, 
  Competition, 
  CompetitionCategory, 
  TournamentTeam,
  SquadValidationResult 
} from "@/types";
import { validateSquad } from "@/lib/registration-utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  ChevronRight,
  UserPlus,
  UserMinus,
  Send
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function TeamRegistration() {
  const { toast } = useToast();
  
  // Selection State
  const [selectedCompId, setSelectedCompId] = React.useState<string>(mockCompetitions[0].id);
  const [selectedCatId, setSelectedCatId] = React.useState<string>(mockCompetitionCategories[0].id);
  
  // Squad State
  const [selectedPlayerIds, setSelectedPlayerIds] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [posFilter, setPosFilter] = React.useState<string>("ALL");
  
  const competition = mockCompetitions.find(c => c.id === selectedCompId);
  const category = mockCompetitionCategories.find(c => c.id === selectedCatId);
  
  const categories = mockCompetitionCategories.filter(c => c.competitionId === selectedCompId);
  
  // Filter players from SSB database
  const filteredPlayers = mockPlayers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = posFilter === "ALL" || p.position === posFilter;
    return matchesSearch && matchesPos;
  });

  const selectedPlayers = mockPlayers.filter(p => selectedPlayerIds.includes(p.id));
  
  const validation: SquadValidationResult = category 
    ? validateSquad(selectedPlayers, category, competition?.startDate || "")
    : { isValid: false, errors: ["Pilih kategori terlebih dahulu"], warnings: [] };

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleSubmitRegistration = () => {
    if (!validation.isValid) {
      toast({
        title: "Registrasi Gagal",
        description: "Silakan perbaiki kesalahan dalam squad sebelum submit.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Registrasi Berhasil",
      description: "Squad tim telah disubmit. Menunggu verifikasi EO.",
    });
    
    // In real app: POST /api/registrasi-tim
    console.log({
      competitionId: selectedCompId,
      categoryId: selectedCatId,
      players: selectedPlayerIds,
      submittedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Registrasi Tim Kompetisi</h1>
          <p className="text-muted-foreground">Pilih kompetisi dan bangun squad tim terbaik Anda.</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedCompId} onValueChange={(val) => {
            setSelectedCompId(val);
            const firstCat = mockCompetitionCategories.find(c => c.competitionId === val);
            if (firstCat) setSelectedCatId(firstCat.id);
          }}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Pilih Kompetisi" />
            </SelectTrigger>
            <SelectContent>
              {mockCompetitions.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCatId} onValueChange={setSelectedCatId}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.ageCategory}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Player Database Selection */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Database Pemain SSB</CardTitle>
                <CardDescription>Pilih pemain untuk didaftarkan ke kompetisi.</CardDescription>
              </div>
              <Badge variant="outline" className="h-6">
                Total: {filteredPlayers.length} Pemain
              </Badge>
            </div>
            <div className="flex gap-3 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari nama pemain..." 
                  className="pl-9" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={posFilter} onValueChange={setPosFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Posisi</SelectItem>
                  {["GK", "CB", "LB", "RB", "CM", "LM", "RM", "ST"].map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[250px]">Pemain</TableHead>
                    <TableHead>Kategori Asal</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => {
                    const isSelected = selectedPlayerIds.includes(player.id);
                    return (
                      <TableRow key={player.id} className={isSelected ? "bg-primary/5" : ""}>
                        <TableCell>
                          <div className="font-bold">{player.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{player.globalId}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{player.ageCategory}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{player.position}</TableCell>
                        <TableCell>
                          <Badge variant={player.status === "active" ? "default" : "destructive"} className="text-[10px] h-5">
                            {player.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={isSelected ? "destructive" : "outline"} 
                            size="sm"
                            className="h-8 gap-1"
                            onClick={() => togglePlayer(player.id)}
                          >
                            {isSelected ? (
                              <><UserMinus className="h-3 w-3" /> Lepas</>
                            ) : (
                              <><UserPlus className="h-3 w-3" /> Pilih</>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Squad Summary & Validation */}
        <div className="space-y-6">
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Squad Summary
              </CardTitle>
              <CardDescription>Review komposisi squad Anda.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Pemain</span>
                  <div className="text-2xl font-black">{selectedPlayerIds.length}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Kuota Kiper</span>
                  <div className="text-2xl font-black">{selectedPlayers.filter(p => p.position === "GK").length}/1</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-primary" /> Validasi Registrasi
                </h4>
                
                {validation.errors.length > 0 && (
                  <div className="space-y-2">
                    {validation.errors.map((err, i) => (
                      <div key={i} className="flex gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
                        <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{err}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.warnings.length > 0 && (
                  <div className="space-y-2">
                    {validation.warnings.map((warn, i) => (
                      <div key={i} className="flex gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                        <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                )}

                {validation.isValid && validation.errors.length === 0 && (
                  <div className="flex gap-2 text-xs text-green-600 bg-green-50 p-3 rounded border border-green-200 font-medium">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Squad memenuhi kriteria kompetisi.
                  </div>
                )}
              </div>

              <Button 
                className="w-full h-12 gap-2 text-lg font-bold shadow-md"
                disabled={!validation.isValid}
                onClick={handleSubmitRegistration}
              >
                <Send className="h-5 w-5" /> Submit Squad Tim
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" /> Posisi Squad
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-4 divide-x divide-y border-t border-b">
                {["GK", "DF", "MF", "FW"].map((group) => {
                  const count = selectedPlayers.filter(p => {
                    if (group === "GK") return p.position === "GK";
                    if (group === "DF") return ["CB", "LB", "RB"].includes(p.position);
                    if (group === "MF") return ["CM", "LM", "RM", "CAM"].includes(p.position);
                    if (group === "FW") return ["ST", "LW", "RW"].includes(p.position);
                    return false;
                  }).length;
                  return (
                    <div key={group} className="p-4 text-center">
                      <div className="text-[10px] font-bold text-muted-foreground">{group}</div>
                      <div className="text-xl font-black">{count}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
