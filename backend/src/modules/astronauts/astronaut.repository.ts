import { db } from "../../database/client.js";
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

  let dataQuery = db
    .selectFrom("astronauts")
    .selectAll()
    .where("deleted_at", "is", null);

  let countQuery = db
    .selectFrom("astronauts")
    .select((eb) => eb.fn.count<number>("id").as("count"))
    .where("deleted_at", "is", null);

  if (params.search && params.search.trim()) {
    const term = `%${params.search.trim()}%`;
    dataQuery = dataQuery.where("name", "ilike", term);
    countQuery = countQuery.where("name", "ilike", term);
  }

  const [rows, countRow] = await Promise.all([
    dataQuery.orderBy("created_at", "desc").limit(limit).offset(offset).execute(),
    countQuery.executeTakeFirst()
  ]);

  const total = Number(countRow?.count ?? 0);

  return {
    data: rows,
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
  const created = await db
    .insertInto("astronauts")
    .values({
      name: data.name,
      role: data.role,
      nationality: data.nationality,
      status: "active",
      created_at: now,
      updated_at: now
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return created;
}

export async function updateAstronaut(id: number, data: UpdateAstronautData): Promise<AstronautRow | null> {
  const updated = await db
    .updateTable("astronauts")
    .set({
      ...data,
      updated_at: new Date()
    })
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .returningAll()
    .executeTakeFirst();

  return updated ?? null;
}

export async function softDeleteAstronaut(id: number): Promise<boolean> {
  const deleted = await db
    .updateTable("astronauts")
    .set({
      deleted_at: new Date(),
      updated_at: new Date()
    })
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .returning("id")
    .executeTakeFirst();

  return Boolean(deleted);
}
