export interface PaginationInput {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

export function resolvePagination(input: PaginationInput): PaginationResult {
  const maxLimit = input.maxLimit ?? 50;
  const page = Number.isFinite(input.page) && (input.page as number) > 0 ? Math.floor(input.page as number) : 1;
  const requestedLimit =
    Number.isFinite(input.limit) && (input.limit as number) > 0 ? Math.floor(input.limit as number) : 10;
  const limit = Math.min(requestedLimit, maxLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function totalPages(total: number, limit: number): number {
  return Math.max(1, Math.ceil(total / limit));
}
