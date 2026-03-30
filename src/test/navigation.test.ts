import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNavigationItems } from "../hooks/use-navigation-items";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../i18n/LanguageContext", () => ({
  useLanguage: vi.fn(() => ({
    t: {
      ssb: { title: "SSB Portal", dashboard: "Dashboard", players: "Players", schedule: "Schedule", attendance: "Attendance", finance: "Finance", profile: "Profile" },
      eo: { title: "EO Portal", dashboard: "Dashboard", tournaments: "Tournaments", teams: "Teams", fixtures: "Fixtures", standings: "Standings" },
      common: { settings: "Settings" },
    },
  })),
}));

const flatItems = (result: any) => result.current.groups.flatMap((g: any) => g.items);

describe("useNavigationItems Hook", () => {
  it("should return SSB items for a coach in SSB portal", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/ssb/dashboard" } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { role: "coach" } } as any);

    const { result } = renderHook(() => useNavigationItems());

    expect(result.current.portalKey).toBe("ssb");
    expect(result.current.groupLabel).toBe("SSB Portal");
    const items = flatItems(result);
    expect(items.length).toBeGreaterThan(0);
    expect(items.some((item: any) => item.url === "/ssb")).toBe(true);
  });

  it("should return EO items for an EO admin in EO portal", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/eo/tournaments" } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { role: "eo_admin" } } as any);

    const { result } = renderHook(() => useNavigationItems());

    expect(result.current.portalKey).toBe("eo");
    expect(result.current.groupLabel).toBe("EO Portal");
    const items = flatItems(result);
    expect(items.some((item: any) => item.url === "/eo/tournaments")).toBe(true);
  });

  it("should return Parent items for a parent in Parent portal", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/parent" } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { role: "parent" } } as any);

    const { result } = renderHook(() => useNavigationItems());

    expect(result.current.portalKey).toBe("parent");
    const items = flatItems(result);
    expect(items.some((item: any) => item.url === "/parent")).toBe(true);
  });

  it("should allow super_admin to see everything in their portal", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/admin" } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { role: "super_admin" } } as any);

    const { result } = renderHook(() => useNavigationItems());

    expect(result.current.portalKey).toBe("admin");
    const items = flatItems(result);
    expect(items.length).toBeGreaterThan(0);
  });

  it("should filter items based on search query", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/ssb" } as any);
    vi.mocked(useAuth).mockReturnValue({ user: { role: "ssb_admin" } } as any);

    const { result } = renderHook(() => useNavigationItems("Dashboard"));

    const items = flatItems(result);
    expect(items.length).toBeGreaterThanOrEqual(1);
    expect(items[0].title).toBe("Dashboard");
  });
});