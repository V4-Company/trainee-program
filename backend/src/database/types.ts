export type AstronautStatus = "active" | "inactive";

export interface AstronautRow {
  id: number;
  name: string;
  role: string;
  nationality: string;
  status: AstronautStatus;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
