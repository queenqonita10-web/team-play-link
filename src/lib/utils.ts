import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AgeCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getAgeCategory(dateOfBirth: string): AgeCategory {
  const age = calculateAge(dateOfBirth);
  if (age < 9) return "U8";
  if (age < 11) return "U10";
  if (age < 13) return "U12";
  if (age < 15) return "U14";
  return "U17";
}
