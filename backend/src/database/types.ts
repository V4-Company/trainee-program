import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export type AstronautStatus = "active" | "inactive";

export interface AstronautTable {
  id: Generated<number>;
  name: string;
  role: string;
  nationality: string;
  status: AstronautStatus;
  deleted_at: ColumnType<Date | null, Date | null | undefined, Date | null>;
  created_at: ColumnType<Date, Date | string | undefined, never>;
  updated_at: ColumnType<Date, Date | string | undefined, Date | string | undefined>;
}

export interface Database {
  astronauts: AstronautTable;
}

export type AstronautRow = Selectable<AstronautTable>;
export type NewAstronautRow = Insertable<AstronautTable>;
export type AstronautUpdateRow = Updateable<AstronautTable>;
