import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { astronautRoutes } from "./modules/astronauts/astronaut.routes.js";

const app = Fastify({ logger: true });
const port = Number(process.env.PORT ?? 3333);

await app.register(cors, {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
});

app.get("/health", async (_request, reply) => {
  return reply.status(200).send({ status: "ok", mission: "Mars Mission Control" });
});

await app.register(astronautRoutes);

app.listen({ port, host: "0.0.0.0" }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
