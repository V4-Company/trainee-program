import { useState, type FormEvent } from "react";
import type { CreateAstronautInput } from "../types/astronaut";

interface AstronautFormProps {
  onSubmit: (input: CreateAstronautInput) => Promise<void>;
  loading: boolean;
}

export function AstronautForm({ onSubmit, loading }: AstronautFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [nationality, setNationality] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ name, role, nationality });
    setName("");
    setRole("");
    setNationality("");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-700 bg-space-800 p-4 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-slate-100">Cadastrar astronauta</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nome"
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-orange-400 focus:ring-2"
          required
          minLength={2}
        />
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="Funcao"
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-orange-400 focus:ring-2"
          required
        />
        <input
          value={nationality}
          onChange={(event) => setNationality(event.target.value)}
          placeholder="Nacionalidade"
          className="rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-orange-400 focus:ring-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 rounded-md bg-orange-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Salvando..." : "Criar astronauta"}
      </button>
    </form>
  );
}
