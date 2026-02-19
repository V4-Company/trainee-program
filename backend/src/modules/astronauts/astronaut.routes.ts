import type { FastifyInstance } from "fastify";
import { createAstronaut, findAstronauts, softDeleteAstronaut, updateAstronaut } from "./astronaut.repository.js";
import {
  parseAstronautId,
  parseCreateAstronautBody,
  parseFindAstronautsQuery,
  parseUpdateAstronautBody,
  type AstronautResponse
} from "./astronaut.schema.js";

function mapAstronaut(row: {
  id: number;
  name: string;
  role: string;
  nationality: string;
  status: "active" | "inactive";
  created_at: Date;
  updated_at: Date;
}): AstronautResponse {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    nationality: row.nationality,
    status: row.status,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString()
  };
}

export async function astronautRoutes(app: FastifyInstance): Promise<void> {
  app.get("/astronauts", async (request, reply) => {
    const query = parseFindAstronautsQuery(request.query as Record<string, unknown>);
    const result = await findAstronauts(query);

    return reply.status(200).send({
      data: result.data.map((row) =>
        mapAstronaut({
          ...row,
          created_at: new Date(row.created_at),
          updated_at: new Date(row.updated_at)
        })
      ),
      pagination: result.pagination
    });
  });

  app.post("/astronauts", async (request, reply) => {
    const parsed = parseCreateAstronautBody(request.body);

    if (parsed.errors.length > 0 || !parsed.data) {
      return reply.status(400).send({
        error: "Validation error",
        details: parsed.errors
      });
    }

    const created = await createAstronaut(parsed.data);

    return reply.status(201).send(
      mapAstronaut({
        ...created,
        created_at: new Date(created.created_at),
        updated_at: new Date(created.updated_at)
      })
    );
  });

  app.put("/astronauts/:id", async (request, reply) => {
    const id = parseAstronautId((request.params as Record<string, unknown>).id);
    if (!id) {
      return reply.status(400).send({
        error: "Validation error",
        details: ["id must be a positive integer"]
      });
    }

    const parsed = parseUpdateAstronautBody(request.body);
    if (parsed.errors.length > 0 || !parsed.data) {
      return reply.status(400).send({
        error: "Validation error",
        details: parsed.errors
      });
    }

    const updated = await updateAstronaut(id, parsed.data);
    if (!updated) {
      return reply.status(404).send({ error: "Astronaut not found" });
    }

    return reply.status(200).send(
      mapAstronaut({
        ...updated,
        created_at: new Date(updated.created_at),
        updated_at: new Date(updated.updated_at)
      })
    );
  });

  app.delete("/astronauts/:id", async (request, reply) => {
    const id = parseAstronautId((request.params as Record<string, unknown>).id);
    if (!id) {
      return reply.status(400).send({
        error: "Validation error",
        details: ["id must be a positive integer"]
      });
    }

    const deleted = await softDeleteAstronaut(id);
    if (!deleted) {
      return reply.status(404).send({ error: "Astronaut not found" });
    }

    return reply.status(204).send();
  });
}
