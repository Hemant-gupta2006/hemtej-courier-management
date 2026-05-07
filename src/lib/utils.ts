import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWeight(value: number | null | undefined, unit: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const u = (unit || "gm").toLowerCase().trim();

  // If unit is grams, display as 0.XXX gm (lowercase, divided by 1000)
  if (u === "gm" || u === "g" || u === "grams") {
    return `${(value / 1000).toFixed(3)} gm`;
  }

  // If unit is kg, display as X kg (lowercase, raw value)
  if (u === "kg" || u === "kilograms") {
    // Remove trailing zeros for kg
    return `${Number(value.toFixed(3))} kg`;
  }

  return `${value} ${u}`;
}

/**
 * Single source of truth for parsing user-entered weight strings (e.g. "1.5kg" or "500gm")
 * into the standardized { value, unit } architecture.
 */
export function parseWeightInput(input: string | null | undefined): { value: number; unit: string } {
  if (!input) return { value: 0, unit: "gm" };
  const lower = input.toLowerCase().trim();
  
  if (lower.includes("kg")) {
    const val = parseFloat(lower) || 0;
    return { value: val, unit: "kg" };
  }
  
  const val = parseFloat(lower) || 0;
  return { value: val, unit: "gm" };
}
