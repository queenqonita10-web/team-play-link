import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { mockPlayers } from "@/data/mock";
import { calculateAge, getAgeCategory } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Upload, User, Calendar, Phone, Mail, MapPin, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import type { DevelopmentNote, Player } from "@/types";

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const basePlayer = mockPlayers.find((p) => p.id === id);
  const [player, setPlayer] = useState<Player | undefined>(basePlayer);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState<"training" | "coach">("training");

  if (!player) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t.common.noData}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/ssb/players")}>
          <ArrowLeft className="h-4 w-4 mr-2" />{t.common.back}
        </Button>
      </div>
    );
  }

  const age = calculateAge(player.dateOfBirth);
  const autoCategory = getAgeCategory(player.dateOfBirth);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote: DevelopmentNote = {
      id: `dn-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      type: noteType,
      note: noteText.trim(),
      author: "Current User",
    };
    setPlayer((prev) => prev ? { ...prev, developmentNotes: [newNote, ...prev.developmentNotes] } : prev);
    setNoteText("");
  };

  const handleToggleStatus = () => {
    setPlayer((prev) => prev ? { ...prev, status: prev.status === "active" ? "inactive" : "active" } : prev);
  };

  const docItems = [
    { key: "birthCertificate" as const, label: t.ssb.birthCertificate, icon: FileText },
    { key: "familyCard" as const, label: t.ssb.familyCard, icon: FileText },
    { key: "photo" as const, label: t.ssb.playerPhoto, icon: User },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/ssb/players")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t.ssb.playerDetail}</h1>
      </div>

      {/* Player header card */}
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-primary font-bold text-lg">{player.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{player.name}</h2>
            <p className="text-sm text-muted-foreground">{player.position} · {autoCategory} · {age} {t.ssb.years}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={player.status === "active" ? "default" : "secondary"}>
              {player.status === "active" ? t.ssb.active : t.ssb.inactive}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleToggleStatus}>
              {player.status === "active" ? t.ssb.inactive : t.ssb.active}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="profile">{t.ssb.profile}</TabsTrigger>
          <TabsTrigger value="documents">{t.ssb.documents}</TabsTrigger>
          <TabsTrigger value="development">{t.ssb.development}</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Info Pemain</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow icon={User} label={t.ssb.playerName} value={player.name} />
                <InfoRow icon={Calendar} label={t.ssb.dateOfBirth} value={player.dateOfBirth} />
                <InfoRow icon={User} label={t.ssb.age} value={`${age} ${t.ssb.years}`} />
                <InfoRow icon={User} label={t.ssb.ageCategory} value={autoCategory} />
                <InfoRow icon={User} label={t.ssb.position} value={player.position} />
                <InfoRow icon={MapPin} label={t.ssb.address} value={player.address} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">{t.ssb.parentName}</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow icon={User} label={t.ssb.parentName} value={player.parentName} />
                <InfoRow icon={Phone} label={t.ssb.parentPhone} value={player.parentPhone} />
                <InfoRow icon={Mail} label={t.ssb.parentEmail} value={player.parentEmail} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <div className="grid gap-4 sm:grid-cols-3">
            {docItems.map(({ key, label, icon: Icon }) => {
              const hasDoc = !!player.documents[key];
              return (
                <Card key={key}>
                  <CardContent className="p-6 text-center space-y-3">
                    <Icon className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="font-medium text-sm">{label}</p>
                    <div className="flex items-center justify-center gap-1 text-xs">
                      {hasDoc ? (
                        <><CheckCircle className="h-3.5 w-3.5 text-primary" /><span className="text-primary">{t.ssb.uploaded}</span></>
                      ) : (
                        <><XCircle className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-muted-foreground">{t.ssb.notUploaded}</span></>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5 w-full">
                      <Upload className="h-3.5 w-3.5" />{t.ssb.uploadDocument}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Development Tab */}
        <TabsContent value="development">
          <Card className="mb-4">
            <CardContent className="p-4 space-y-3">
              <div className="flex gap-3">
                <Select value={noteType} onValueChange={(v) => setNoteType(v as "training" | "coach")}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">{t.ssb.trainingNote}</SelectItem>
                    <SelectItem value="coach">{t.ssb.coachNote}</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddNote}>{t.ssb.addNote}</Button>
              </div>
              <Textarea
                placeholder={t.ssb.noteContent}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {player.developmentNotes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t.ssb.noNotes}</p>
          ) : (
            <div className="space-y-3">
              {player.developmentNotes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {note.type === "training" ? t.ssb.trainingNote : t.ssb.coachNote}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
                        </div>
                        <p className="text-sm">{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">— {note.author}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
