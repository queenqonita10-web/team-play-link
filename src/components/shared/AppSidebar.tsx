import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Calendar, ClipboardCheck, Wallet, Trophy, Shield, ListOrdered, LogOut, ShieldCheck } from "lucide-react";

const ssbItems = (t: any) => [
  { title: t.ssb.dashboard, url: "/ssb", icon: LayoutDashboard },
  { title: t.ssb.players, url: "/ssb/players", icon: Users },
  { title: "Registrasi Tim", url: "/ssb/registration", icon: ShieldCheck },
  { title: t.ssb.schedule, url: "/ssb/schedule", icon: Calendar },
  { title: t.ssb.attendance, url: "/ssb/attendance", icon: ClipboardCheck },
  { title: t.ssb.finance, url: "/ssb/finance", icon: Wallet },
];

const eoItems = (t: any) => [
  { title: t.eo.dashboard, url: "/eo", icon: LayoutDashboard },
  { title: t.eo.tournaments, url: "/eo/tournaments", icon: Trophy },
  { title: t.eo.teams, url: "/eo/teams", icon: Shield },
  { title: t.eo.fixtures, url: "/eo/fixtures", icon: Calendar },
  { title: t.eo.standings, url: "/eo/standings", icon: ListOrdered },
];

const parentItems = (t: any) => [
  { title: "Parent Dashboard", url: "/parent", icon: LayoutDashboard },
  { title: "Schedule", url: "/ssb/schedule", icon: Calendar }, // Reusing SSB schedule
  { title: "Finance", url: "/ssb/finance", icon: Wallet },     // Reusing SSB finance
];

export function AppSidebar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";

  const isSSB = location.pathname.startsWith("/ssb");
  const isEO = location.pathname.startsWith("/eo");
  const isParent = location.pathname.startsWith("/parent");

  let items = ssbItems(t);
  let groupLabel = t.ssb.title;

  if (isEO) {
    items = eoItems(t);
    groupLabel = t.eo.title;
  } else if (isParent) {
    items = parentItems(t);
    groupLabel = "Parent Portal";
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <span className="text-sidebar-primary-foreground font-bold text-xs">FG</span>
          </div>
          {!collapsed && <span className="font-bold text-sm truncate">{t.common.appName}</span>}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/ssb" || item.url === "/eo"} className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="text-xs text-sidebar-foreground/70 mb-2 truncate">{user.name} · {user.role}</div>
        )}
        <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent gap-2">
          <LogOut className="h-4 w-4" />
          {!collapsed && t.common.logout}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
