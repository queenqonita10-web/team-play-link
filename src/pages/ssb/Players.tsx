import * as React from "react";
import { PlayerTable } from "@/components/ssb/PlayerTable";
import { PlayerForm } from "@/components/ssb/PlayerForm";
import { Player } from "@/types";
import { mockPlayers } from "@/data/mock";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function PlayersPage() {
  const { toast } = useToast();
  const [players, setPlayers] = React.useState<Player[]>(mockPlayers);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingPlayer, setEditingPlayer] = React.useState<Player | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // Simulate data fetching
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setIsFormOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleDeletePlayer = (player: Player) => {
    // In a real app, this would be a soft delete API call
    setPlayers(prev => prev.filter(p => p.id !== player.id));
    toast({
      title: "Pemain Dihapus",
      description: `Data pemain ${player.name} telah berhasil dihapus (soft delete).`,
    });
  };

  const handleFormSubmit = (data: any) => {
    if (editingPlayer) {
      // Update
      setPlayers(prev => prev.map(p => p.id === editingPlayer.id ? { ...p, ...data } : p));
      toast({
        title: "Pemain Diperbarui",
        description: `Data pemain ${data.name} berhasil disimpan.`,
      });
    } else {
      // Create
      const newPlayer: Player = {
        ...data,
        id: `p-${Date.now()}`,
        globalId: `P-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        ssbId: "ssb1",
        verificationStatus: "pending",
        documents: {},
        competitionHistory: [],
        developmentNotes: [],
        createdAt: new Date().toISOString(),
      };
      setPlayers(prev => [newPlayer, ...prev]);
      toast({
        title: "Pemain Terdaftar",
        description: `${data.name} telah berhasil ditambahkan ke database SSB.`,
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" /> Manajemen Pemain
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data registrasi, dokumen, dan status keanggotaan pemain SSB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pemain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{players.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pemain Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {players.filter(p => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/5 border-blue-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terverifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {players.filter(p => p.verificationStatus === "verified").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Menunggu Verifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {players.filter(p => p.verificationStatus === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert className="bg-muted/30 border-muted">
        <Info className="h-4 w-4" />
        <AlertTitle>Informasi Sistem</AlertTitle>
        <AlertDescription>
          Gunakan fitur pencarian dan filter untuk mengelola pemain berdasarkan kategori umur atau posisi bermain secara spesifik.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <PlayerTable 
          players={players}
          onAdd={handleAddPlayer}
          onEdit={handleEditPlayer}
          onDelete={handleDeletePlayer}
          onViewDetail={(p) => console.log("Detail", p)}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingPlayer ? "Edit Data Pemain" : "Pendaftaran Pemain Baru"}
            </DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini. Pastikan data NIK dan Tanggal Lahir sudah sesuai.
            </DialogDescription>
          </DialogHeader>
          <PlayerForm 
            initialData={editingPlayer}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
