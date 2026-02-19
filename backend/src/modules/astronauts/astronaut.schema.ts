export interface FindAstronautsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAstronautData {
  name: string;
  role: string;
  nationality: string;
}

export interface UpdateAstronautData {
  name?: string;
  role?: string;
  nationality?: string;
  status?: "active" | "inactive";
}

export interface AstronautResponse {
  id: number;
  name: string;
  role: string;
  nationality: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export function parseFindAstronautsQuery(query: Record<string, unknown>): FindAstronautsParams {
  const search = typeof query.search === "string" ? query.search.trim() : undefined;
  const page = typeof query.page === "string" ? Number(query.page) : undefined;
  const limit = typeof query.limit === "string" ? Number(query.limit) : undefined;

  return { search, page, limit };
}

export function parseCreateAstronautBody(body: unknown): {
  data?: CreateAstronautData;
  errors: string[];
} {
  if (!body || typeof body !== "object") {
    return { errors: ["body must be an object"] };
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const role = typeof input.role === "string" ? input.role.trim() : "";
  const nationality = typeof input.nationality === "string" ? input.nationality.trim() : "";

  if (!name) errors.push("name is required");
  if (name && name.length < 2) errors.push("name must have at least 2 characters");
  if (!role) errors.push("role is required");
  if (!nationality) errors.push("nationality is required");

  if (errors.length > 0) {
    return { errors };
  }

  return {
    data: { name, role, nationality },
    errors: []
  };
}

export function parseAstronautId(value: unknown): number | null {
  const parsed = typeof value === "string" || typeof value === "number" ? Number(value) : Number.NaN;
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

export function parseUpdateAstronautBody(body: unknown): {
  data?: UpdateAstronautData;
  errors: string[];
} {
  if (!body || typeof body !== "object") {
    return { errors: ["body must be an object"] };
  }

  const input = body as Record<string, unknown>;
  const errors: string[] = [];
  const data: UpdateAstronautData = {};

  if ("name" in input) {
    if (typeof input.name !== "string" || input.name.trim().length < 2) {
      errors.push("name must have at least 2 characters");
    } else {
      data.name = input.name.trim();
    }
  }

  if ("role" in input) {
    if (typeof input.role !== "string" || !input.role.trim()) {
      errors.push("role is required when provided");
    } else {
      data.role = input.role.trim();
    }
  }

  if ("nationality" in input) {
    if (typeof input.nationality !== "string" || !input.nationality.trim()) {
      errors.push("nationality is required when provided");
    } else {
      data.nationality = input.nationality.trim();
    }
  }

  if ("status" in input) {
    if (input.status !== "active" && input.status !== "inactive") {
      errors.push("status must be active or inactive");
    } else {
      data.status = input.status;
    }
  }

  if (Object.keys(data).length === 0) {
    errors.push("at least one field is required");
  }

  if (errors.length > 0) {
    return { errors };
  }

  return { data, errors: [] };
}
