import type { Astronaut, AstronautsResponse, CreateAstronautInput, UpdateAstronautInput } from "../types/astronaut";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string; details?: string[] };
    if (payload?.details?.length) {
      return `${payload.error ?? fallback}: ${payload.details.join(", ")}`;
    }
    return payload?.error ?? fallback;
  } catch {
    return fallback;
  }
}

export async function fetchAstronauts(params: { page: number; limit: number; search?: string }): Promise<AstronautsResponse> {
  const url = new URL("/astronauts", API_BASE_URL);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("limit", String(params.limit));

  if (params.search) {
    url.searchParams.set("search", params.search);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Falha ao carregar astronautas."));
  }

  return response.json() as Promise<AstronautsResponse>;
}

export async function createAstronaut(input: CreateAstronautInput): Promise<Astronaut> {
  const response = await fetch(`${API_BASE_URL}/astronauts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Falha ao criar astronauta."));
  }

  return response.json() as Promise<Astronaut>;
}

export async function updateAstronaut(id: number, input: UpdateAstronautInput): Promise<Astronaut> {
  const response = await fetch(`${API_BASE_URL}/astronauts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Falha ao atualizar astronauta."));
  }

  return response.json() as Promise<Astronaut>;
}

export async function softDeleteAstronaut(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/astronauts/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Falha ao deletar astronauta."));
  }
}
