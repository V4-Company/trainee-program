import { pool } from "../../database/client.js";
import { resolvePagination, totalPages } from "../../shared/pagination.js";

import type { AstronautRow } from "../../database/types.js";
import type { CreateAstronautData, FindAstronautsParams, UpdateAstronautData } from "./astronaut.schema.js";

export interface AstronautsResult {
  data: AstronautRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function findAstronauts(params: FindAstronautsParams): Promise<AstronautsResult> {
  const { page, limit, offset } = resolvePagination({ page: params.page, limit: params.limit, maxLimit: 50 });

  const conditions = ["deleted_at IS NULL"];
  const values: unknown[] = [];

  if (params.search?.trim()) {
    values.push(`%${params.search.trim()}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const countResult = await pool.query<{ count: string }>(`SELECT COUNT(id) AS count FROM astronauts ${where}`, values);
  const total = Number(countResult.rows[0].count);

  const dataResult = await pool.query<AstronautRow>(
    `SELECT * FROM astronauts ${where} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  return {
    data: dataResult.rows,
    pagination: { total, page, limit, totalPages: totalPages(total, limit) }
  };
}

export async function createAstronaut(data: CreateAstronautData): Promise<AstronautRow> {
  const now = new Date();

  const { rows } = await pool.query<AstronautRow>(
    `INSERT INTO astronauts (name, role, nationality, status, created_at, updated_at)
     VALUES ($1, $2, $3, 'active', $4, $4)
     RETURNING *`,
    [data.name, data.role, data.nationality, now]
  );

  return rows[0];
}
