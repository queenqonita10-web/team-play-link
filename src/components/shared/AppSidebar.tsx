import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Search, X } from "lucide-react";
import { useNavigationItems } from "@/hooks/use-navigation-items";
import { Input } from "@/components/ui/input";
import * as React from "react";

/**
 * AppSidebar component provides the main navigation for the application.
 * It dynamically switches items based on the current portal (SSB, EO, Parent, etc.)
 * and the user's role.
 */
export function AppSidebar() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const { groups, groupLabel, portalKey } = useNavigationItems(searchQuery);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" role="navigation" aria-label="Main Navigation">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div 
            className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-sidebar-primary-foreground font-bold text-xs">FG</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm truncate select-none leading-none mb-1">
                {t.common.appName}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider truncate leading-none">
                {groupLabel}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 scrollbar-none">
        {!collapsed && (
          <div className="px-4 py-4 sticky top-0 bg-sidebar z-10">
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder="Cari modul..." 
                className="h-9 pl-8 pr-8 text-xs bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary transition-all hover:bg-muted/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search modules"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-2">
          {groups.length > 0 ? (
            groups.map((group, groupIdx) => (
              <SidebarGroup key={group.label || groupIdx} className="py-2">
                {group.label && !collapsed && (
                  <SidebarGroupLabel className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 select-none">
                    {group.label}
                  </SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={collapsed ? item.title : undefined}
                          className="w-full"
                        >
                          <NavLink 
                            to={item.url} 
                            end={item.url === `/${portalKey}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/50 group/item focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring relative overflow-hidden"
                            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:h-5 after:w-1 after:bg-primary after:rounded-r-full"
                          >
                            <item.icon className="h-4.5 w-4.5 shrink-0 transition-transform group-hover/item:scale-110 group-active/item:scale-95" aria-hidden="true" />
                            {!collapsed && <span className="truncate text-sm tracking-tight">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          ) : (
            !collapsed && (
              <div className="px-4 py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-3 flex justify-center">
                  <Search className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">Tidak ada modul ditemukan</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Coba kata kunci lain</p>
              </div>
            )
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 bg-sidebar/50 backdrop-blur-sm">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl bg-muted/40 border border-border/50 transition-all hover:bg-muted/60">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-primary/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-sidebar-foreground truncate leading-tight" title={user.name}>
                {user.name}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter truncate leading-tight mt-0.5">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive gap-3 px-3 py-2.5 h-auto rounded-lg transition-all group focus-visible:ring-2 focus-visible:ring-destructive/20"
          aria-label={t.common.logout}
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          {!collapsed && <span className="text-xs font-bold tracking-wide uppercase">{t.common.logout}</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
