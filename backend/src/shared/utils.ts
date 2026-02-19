import { ZodError } from "zod";
import { AstronautRow } from "../database/types.js";

export function formatRow(row: AstronautRow) {
  return {
    ...row,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString()
  };
}

export function formatZodError(error: ZodError) {
  return {
    error: "Validation error",
    details: error.issues.map((i) => i.message)
  };
}
