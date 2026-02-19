import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { createAstronaut, findAstronauts, softDeleteAstronaut, updateAstronaut } from "./astronaut.repository.js";
import { astronautId, createAstronautBody, findAstronautsQuery, updateAstronautBody } from "./astronaut.schema.js";
import { formatRow, formatZodError } from "../../shared/utils.js";

export async function astronautRoutes(app: FastifyInstance): Promise<void> {
  app.get("/astronauts", async (request, reply) => {
    const query = findAstronautsQuery.parse(request.query);
    const result = await findAstronauts(query);

    return reply.status(200).send({
      data: result.data.map(formatRow),
      pagination: result.pagination
    });
  });

  app.post("/astronauts", async (request, reply) => {
    const body = createAstronautBody.parse(request.body);
    const created = await createAstronaut(body);

    return reply.status(201).send(formatRow(created));
  });

  app.put("/astronauts/:id", async (request, reply) => {
    const id = astronautId.parse((request.params as Record<string, unknown>).id);
    const body = updateAstronautBody.parse(request.body);

    const updated = await updateAstronaut(id, body);
    if (!updated) {
      return reply.status(404).send({ error: "Astronaut not found" });
    }

    return reply.status(200).send(formatRow(updated));
  });

  app.delete("/astronauts/:id", async (request, reply) => {
    const id = astronautId.parse((request.params as Record<string, unknown>).id);

    const deleted = await softDeleteAstronaut(id);
    if (!deleted) {
      return reply.status(404).send({ error: "Astronaut not found" });
    }

    return reply.status(204).send();
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send(formatZodError(error));
    }
    reply.status(500).send({ error: "Internal server error" });
  });
}
