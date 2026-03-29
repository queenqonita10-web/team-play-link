import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/shared/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const defaultRole = (location.state as any)?.defaultRole || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">(defaultRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    login(email, password, role);
    if (role === "admin_ssb" || role === "coach") navigate("/ssb");
    else if (role === "admin_eo") navigate("/eo");
    else navigate("/parent");
  };

  const roles: { value: UserRole; label: string }[] = [
    { value: "admin_ssb", label: t.auth.roleAdminSSB },
    { value: "coach", label: t.auth.roleCoach },
    { value: "parent", label: t.auth.roleParent },
    { value: "admin_eo", label: t.auth.roleAdminEO },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">FG</span>
            </div>
          </Link>
          <CardTitle className="text-2xl">{t.auth.loginTitle}</CardTitle>
          <CardDescription>{t.auth.loginSubtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t.auth.email}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.password}</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="space-y-2">
              <Label>{t.auth.selectRole}</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue placeholder={t.auth.selectRole} /></SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={!role}>{t.common.login}</Button>
            <p className="text-center text-sm text-muted-foreground">
              {t.auth.noAccount}{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">{t.common.register}</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
