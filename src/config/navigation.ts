import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  Wallet, 
  Trophy, 
  Shield, 
  ListOrdered, 
  ShieldCheck,
  Search,
  Settings,
  FileText,
  User,
  LucideIcon
} from "lucide-react";
import { UserRole } from "@/types";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface PortalConfig {
  portalLabel: string;
  groups: (t: any) => NavGroup[];
}

const COMMON_GROUPS = (t: any, portalKey: string): NavGroup[] => [
  {
    label: "Account",
    items: [
      { title: t.ssb.profile, url: `/${portalKey}/profile`, icon: User },
      { title: t.common.settings, url: `/${portalKey}/settings`, icon: Settings },
    ]
  }
];

export const NAVIGATION_CONFIG: Record<string, PortalConfig> = {
  admin: {
    portalLabel: "Super Admin",
    groups: (t) => [
      {
        label: "Main",
        items: [
          { title: "Global Dashboard", url: "/admin", icon: LayoutDashboard },
          { title: "Global Search", url: "/admin/search", icon: Search },
        ]
      },
      {
        label: "Management",
        items: [
          { title: "Organizations", url: "/admin/organizations", icon: Shield },
          { title: "User Management", url: "/admin/users", icon: Users },
        ]
      },
      ...COMMON_GROUPS(t, "admin")
    ],
  },
  ssb: {
    portalLabel: "SSB Portal",
    groups: (t) => [
      {
        label: "Overview",
        items: [
          { title: t.ssb.dashboard, url: "/ssb", icon: LayoutDashboard },
        ]
      },
      {
        label: "Player Management",
        items: [
          { title: t.ssb.players, url: "/ssb/players", icon: Users },
          { title: "Registrasi Tim", url: "/ssb/registration", icon: ShieldCheck },
        ]
      },
      {
        label: "Operations",
        items: [
          { title: t.ssb.schedule, url: "/ssb/schedule", icon: Calendar },
          { title: t.ssb.attendance, url: "/ssb/attendance", icon: ClipboardCheck },
        ]
      },
      {
        label: "Finance",
        items: [
          { title: t.ssb.finance, url: "/ssb/finance", icon: Wallet },
        ]
      },
      ...COMMON_GROUPS(t, "ssb")
    ],
  },
  eo: {
    portalLabel: "EO Portal",
    groups: (t) => [
      {
        label: "Overview",
        items: [
          { title: t.eo.dashboard, url: "/eo", icon: LayoutDashboard },
        ]
      },
      {
        label: "Competition",
        items: [
          { title: t.eo.tournaments, url: "/eo/tournaments", icon: Trophy },
          { title: t.eo.teams, url: "/eo/teams", icon: Shield },
        ]
      },
      {
        label: "Match Day",
        items: [
          { title: t.eo.fixtures, url: "/eo/fixtures", icon: Calendar },
          { title: t.eo.standings, url: "/eo/standings", icon: ListOrdered },
        ]
      },
      {
        label: "Finance",
        items: [
          { title: "Pendaftaran & Keuangan", url: "/eo/registrations", icon: Wallet },
        ]
      },
      ...COMMON_GROUPS(t, "eo")
    ],
  },
  scout: {
    portalLabel: "Scout Portal",
    groups: (t) => [
      {
        items: [
          { title: "Scouting Dashboard", url: "/scout", icon: LayoutDashboard },
          { title: "Player Search", url: "/scout/search", icon: Search },
          { title: "Talent Reports", url: "/scout/reports", icon: FileText },
        ]
      },
      ...COMMON_GROUPS(t, "scout")
    ],
  },
  parent: {
    portalLabel: "Parent Portal",
    groups: (t) => [
      {
        label: "Child Monitoring",
        items: [
          { title: "Parent Dashboard", url: "/parent", icon: LayoutDashboard },
          { title: "Jadwal & Latihan", url: "/parent/schedule", icon: Calendar },
          { title: "Progress Report", url: "/parent/progress", icon: ListOrdered },
        ]
      },
      {
        label: "Finance",
        items: [
          { title: "Tagihan & Iuran", url: "/parent/finance", icon: Wallet },
        ]
      },
      ...COMMON_GROUPS(t, "parent")
    ],
  },
};
