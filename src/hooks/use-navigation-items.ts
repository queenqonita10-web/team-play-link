import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { NAVIGATION_CONFIG, NavItem, NavGroup } from "@/config/navigation";
import { UserRole } from "@/types";

export function useNavigationItems(searchQuery: string = "") {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  const portalInfo = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/admin")) return { key: "admin", label: "Super Admin" };
    if (path.startsWith("/eo")) return { key: "eo", label: t.eo.title };
    if (path.startsWith("/parent")) return { key: "parent", label: "Parent Portal" };
    if (path.startsWith("/scout")) return { key: "scout", label: "Scout Portal" };
    return { key: "ssb", label: t.ssb.title };
  }, [location.pathname, t.eo.title, t.ssb.title]);

  const filteredGroups = useMemo(() => {
    if (!user) return [];
    
    const config = NAVIGATION_CONFIG[portalInfo.key];
    if (!config) return [];

    const allGroups = config.groups(t);

    return allGroups.map(group => {
      const filteredItems = group.items.filter(item => {
        // 1. Role-based filtering
        let hasAccess = false;
        if (user.role === "super_admin") {
          hasAccess = true;
        } else if (item.roles && item.roles.includes(user.role)) {
          hasAccess = true;
        } else {
          // Portal-wide default access
          const isSuperAdmin = user.role === "super_admin";
          
          switch (portalInfo.key) {
            case "ssb":
              hasAccess = isSuperAdmin || user.role === "ssb_admin" || user.role === "coach";
              break;
            case "eo":
              hasAccess = isSuperAdmin || user.role === "eo_admin" || user.role === "eo_operator";
              break;
            case "parent":
              hasAccess = isSuperAdmin || user.role === "parent" || user.role === "coach" || user.role === "ssb_admin";
              break;
            case "scout":
              hasAccess = isSuperAdmin || user.role === "scout";
              break;
            case "admin":
              hasAccess = isSuperAdmin;
              break;
            default:
              hasAccess = true;
          }
        }

        if (!hasAccess) return false;

        // 2. Search filtering
        if (searchQuery) {
          return item.title.toLowerCase().includes(searchQuery.toLowerCase());
        }

        return true;
      });

      return {
        ...group,
        items: filteredItems
      };
    }).filter(group => group.items.length > 0);
  }, [user, portalInfo.key, t, searchQuery]);

  return {
    groups: filteredGroups,
    groupLabel: portalInfo.label,
    portalKey: portalInfo.key
  };
}
