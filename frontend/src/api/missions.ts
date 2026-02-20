import type { Mission } from "../types/missions";

const INITIAL_MISSIONS: Mission[] = [
  { id: "MS-01", nome: "Aurora Rubra", astronautId: null, supplyId: null },
  { id: "MS-02", nome: "Crimson Relay", astronautId: null, supplyId: null },
  { id: "MS-03", nome: "Helios Forge", astronautId: null, supplyId: null }
];

let missionsStore: Mission[] = INITIAL_MISSIONS.map((item) => ({ ...item }));

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function fetchMissions(): Promise<Mission[]> {
  await wait(200);
  return missionsStore.map((item) => ({ ...item }));
}

export async function createMission(input: { nome: string; astronautId: number; supplyId: string }): Promise<Mission> {
  await wait(250);
  const created: Mission = {
    id: `MS-${Math.floor(Math.random() * 900 + 100)}`,
    nome: input.nome,
    astronautId: input.astronautId,
    supplyId: input.supplyId
  };
  missionsStore = [created, ...missionsStore];
  return { ...created };
}
