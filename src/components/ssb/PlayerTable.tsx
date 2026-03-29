import * as React from "react";
import { 
  Player, 
  Position, 
  AgeCategory, 
  PlayerStatus 
} from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface PlayerTableProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (player: Player) => void;
  onAdd: () => void;
  onViewDetail: (player: Player) => void;
}

export function PlayerTable({ players, onEdit, onDelete, onAdd, onViewDetail }: PlayerTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [positionFilter, setPositionFilter] = React.useState<string>("all");
  const [categoryFilter, setAgeCategoryFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         player.nik.includes(searchTerm);
    const matchesPosition = positionFilter === "all" || player.position === positionFilter;
    const matchesCategory = categoryFilter === "all" || player.ageCategory === categoryFilter;
    const matchesStatus = statusFilter === "all" || player.status === statusFilter;
    
    return matchesSearch && matchesPosition && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPlayers.length / itemsPerPage);
  const paginatedPlayers = filteredPlayers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: PlayerStatus) => {
    return status === "active" ? 
      <Badge className="bg-green-500">Aktif</Badge> : 
      <Badge variant="secondary">Nonaktif</Badge>;
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified": return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Verified</Badge>;
      case "pending": return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>;
      case "rejected": return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">Unverified</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari nama atau NIK..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Posisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Posisi</SelectItem>
              <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
              <SelectItem value="defender">Defender</SelectItem>
              <SelectItem value="midfielder">Midfielder</SelectItem>
              <SelectItem value="forward">Forward</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setAgeCategoryFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {["U9", "U11", "U13", "U15", "U17", "U20", "Senior"].map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Nonaktif</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onAdd} className="gap-2">
            <UserPlus className="h-4 w-4" /> Tambah Pemain
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama & Global ID</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Umur / Kategori</TableHead>
              <TableHead>Posisi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verifikasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlayers.length > 0 ? (
              paginatedPlayers.map((player) => (
                <TableRow key={player.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{player.globalId}</div>
                  </TableCell>
                  <TableCell className="text-sm">{player.nik}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{player.age} Thn</div>
                    <div className="text-xs text-muted-foreground">{player.ageCategory}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{player.position}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(player.status)}</TableCell>
                  <TableCell>{getVerificationBadge(player.verificationStatus)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi Pemain</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewDetail(player)}>
                          <FileText className="h-4 w-4 mr-2" /> Detail Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(player)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit Data
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => onDelete(player)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Hapus (Soft Delete)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Tidak ada data pemain yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredPlayers.length)} dari {filteredPlayers.length} pemain
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
