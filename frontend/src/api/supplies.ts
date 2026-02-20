import { supplies as initialSupplies } from "../data/fake-data";
import type { Supply } from "../types/supplies";

let suppliesStore: Supply[] = initialSupplies.map((item) => ({ ...item }));

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export async function fetchSupplies(): Promise<Supply[]> {
  await wait(200);
  return suppliesStore.map((item) => ({ ...item }));
}

export async function createSupply(input: { item: string; categoria: string; estoque: number }): Promise<Supply> {
  await wait(250);
  const created: Supply = {
    id: `SUP-${Math.floor(Math.random() * 900 + 100)}`,
    item: input.item,
    categoria: input.categoria,
    estoque: Math.max(0, Math.min(100, input.estoque)),
    unidade: "%"
  };
  suppliesStore = [created, ...suppliesStore];
  return { ...created };
}

export async function deleteSupply(id: string): Promise<void> {
  await wait(250);
  suppliesStore = suppliesStore.filter((item) => item.id !== id);
}
