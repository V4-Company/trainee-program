import { pool } from "../../database/client.js";
import type { AstronautRow } from "../../database/types.js";
import { resolvePagination, totalPages } from "../../shared/pagination.js";
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
  const { page, limit, offset } = resolvePagination({
    page: params.page,
    limit: params.limit,
    maxLimit: 50
  });

  const hasSearch = params.search && params.search.trim();
  const searchTerm = hasSearch ? `%${params.search!.trim()}%` : null;

  let dataSQL: string;
  let countSQL: string;
  let queryParams: unknown[];

  if (searchTerm) {
    dataSQL = `
      SELECT * FROM astronauts
      WHERE deleted_at IS NULL AND name ILIKE $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    countSQL = `
      SELECT COUNT(id) AS count FROM astronauts
      WHERE deleted_at IS NULL AND name ILIKE $1
    `;
    queryParams = [searchTerm, limit, offset];
  } else {
    dataSQL = `
      SELECT * FROM astronauts
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    countSQL = `
      SELECT COUNT(id) AS count FROM astronauts
      WHERE deleted_at IS NULL
    `;
    queryParams = [limit, offset];
  }

  const [dataResult, countResult] = await Promise.all([
    pool.query<AstronautRow>(dataSQL, queryParams),
    pool.query<{ count: string }>(countSQL, searchTerm ? [searchTerm] : [])
  ]);

  const total = Number(countResult.rows[0]?.count ?? 0);

  return {
    data: dataResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: totalPages(total, limit)
    }
  };
}

export async function createAstronaut(data: CreateAstronautData): Promise<AstronautRow> {
  const now = new Date();

  const { rows } = await pool.query<AstronautRow>(
    `INSERT INTO astronauts (name, role, nationality, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [data.name, data.role, data.nationality, "active", now, now]
  );

  return rows[0];
}

export async function updateAstronaut(id: number, data: UpdateAstronautData): Promise<AstronautRow | null> {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.role !== undefined) {
    setClauses.push(`role = $${paramIndex++}`);
    values.push(data.role);
  }
  if (data.nationality !== undefined) {
    setClauses.push(`nationality = $${paramIndex++}`);
    values.push(data.nationality);
  }
  if (data.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    values.push(data.status);
  }

  setClauses.push(`updated_at = $${paramIndex++}`);
  values.push(new Date());

  values.push(id);
  const idParam = `$${paramIndex}`;

  const { rows } = await pool.query<AstronautRow>(
    `UPDATE astronauts
     SET ${setClauses.join(", ")}
     WHERE id = ${idParam} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  return rows[0] ?? null;
}

export async function softDeleteAstronaut(id: number): Promise<boolean> {
  const now = new Date();

  const { rowCount } = await pool.query(
    `UPDATE astronauts
     SET deleted_at = $1, updated_at = $2
     WHERE id = $3 AND deleted_at IS NULL`,
    [now, now, id]
  );

  return (rowCount ?? 0) > 0;
}
