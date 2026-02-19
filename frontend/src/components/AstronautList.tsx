import type { Astronaut } from "../types/astronaut";

interface AstronautListProps {
  astronauts: Astronaut[];
}

export function AstronautList({ astronauts }: AstronautListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-space-800 shadow-md">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Função</th>
            <th className="px-4 py-3">Nacionalidade</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Data de cadastro</th>
          </tr>
        </thead>
        <tbody>
          {astronauts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                Nenhum astronauta encontrado.
              </td>
            </tr>
          ) : (
            astronauts.map((astronaut) => (
              <tr key={astronaut.id} className="border-t border-slate-700">
                <td className="px-4 py-3">{astronaut.name}</td>
                <td className="px-4 py-3">{astronaut.role}</td>
                <td className="px-4 py-3">{astronaut.nationality}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      astronaut.status === "active"
                        ? "rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300"
                        : "rounded-full bg-slate-500/20 px-3 py-1 text-xs font-semibold text-slate-300"
                    }
                  >
                    {astronaut.status}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(astronaut.created_at).toLocaleString("pt-BR")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
