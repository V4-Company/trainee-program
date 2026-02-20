import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { MissionFormProps } from "../../../types/missions";

export function MissionForm({
  form,
  missionError,
  astronauts,
  supplies,
  onFormChange,
  onSubmit
}: MissionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Cadastrar missao (fake)</CardTitle>
        <CardDescription>Selecione nome, astronauta e suprimento.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder="Nome da missao"
            value={form.nome}
            onChange={(event) => onFormChange((current) => ({ ...current, nome: event.target.value }))}
          />
          <select
            value={form.astronautId}
            onChange={(event) => onFormChange((current) => ({ ...current, astronautId: event.target.value }))}
            className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
          >
            <option value="">Selecione astronauta</option>
            {astronauts.map((astronaut) => (
              <option key={astronaut.id} value={astronaut.id}>
                {astronaut.name} - {astronaut.role}
              </option>
            ))}
          </select>

          <select
            value={form.supplyId}
            onChange={(event) => onFormChange((current) => ({ ...current, supplyId: event.target.value }))}
            className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
          >
            <option value="">Selecione suprimento</option>
            {supplies.map((supply) => (
              <option key={supply.id} value={supply.id}>
                {supply.item}
              </option>
            ))}
          </select>

          {missionError ? <p className="md:col-span-3 text-sm text-red-300">{missionError}</p> : null}

          <div className="md:col-span-3">
            <Button type="submit">Criar missao</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
