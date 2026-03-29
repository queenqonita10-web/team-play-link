import { describe, it, expect } from "vitest";
import { AttendanceRecord, AttendanceStatus } from "@/types";

function calculateAttendanceRate(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;
  const presentCount = records.filter(r => r.status === "present").length;
  return (presentCount / records.length) * 100;
}

function getPlayerAttendanceStats(playerId: string, records: AttendanceRecord[]) {
  const pRecords = records.filter(r => r.playerId === playerId);
  const total = pRecords.length;
  const present = pRecords.filter(r => r.status === "present").length;
  const permitted = pRecords.filter(r => r.status === "permitted").length;
  const absent = pRecords.filter(r => r.status === "absent").length;
  
  return {
    total,
    present,
    permitted,
    absent,
    rate: total > 0 ? (present / total) * 100 : 0
  };
}

describe("Attendance Logic", () => {
  const mockRecords: AttendanceRecord[] = [
    { id: "1", playerId: "p1", sessionId: "s1", date: "2026-03-01", status: "present", method: "manual", createdAt: "", updatedAt: "" },
    { id: "2", playerId: "p1", sessionId: "s2", date: "2026-03-02", status: "absent", method: "manual", createdAt: "", updatedAt: "" },
    { id: "3", playerId: "p1", sessionId: "s3", date: "2026-03-03", status: "present", method: "qr_code", createdAt: "", updatedAt: "" },
    { id: "4", playerId: "p2", sessionId: "s1", date: "2026-03-01", status: "permitted", method: "manual", createdAt: "", updatedAt: "" },
  ];

  it("should calculate correct overall attendance rate", () => {
    expect(calculateAttendanceRate(mockRecords)).toBe(50); // 2 present out of 4 total
  });

  it("should calculate correct player statistics", () => {
    const p1Stats = getPlayerAttendanceStats("p1", mockRecords);
    expect(p1Stats.total).toBe(3);
    expect(p1Stats.present).toBe(2);
    expect(p1Stats.absent).toBe(1);
    expect(p1Stats.rate).toBeCloseTo(66.67, 1);

    const p2Stats = getPlayerAttendanceStats("p2", mockRecords);
    expect(p2Stats.total).toBe(1);
    expect(p2Stats.permitted).toBe(1);
    expect(p2Stats.rate).toBe(0);
  });

  it("should return 0 for empty records", () => {
    expect(calculateAttendanceRate([])).toBe(0);
    expect(getPlayerAttendanceStats("p3", []).rate).toBe(0);
  });
});
