import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import type { MissionsPageProps } from "../types";
import { StatCard } from "../components/StatCard";

export function MissionsPage({
  missions,
  missionForm,
  supplies,
  astronauts,
  missionError,
  onChangeForm,
  onAddSupply,
  onRemoveSupply,
  onCreateMission
}: MissionsPageProps) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Missoes ativas" value={String(missions.filter((item) => item.status === "Ativa").length)} description="Operacao em tempo real" />
        <StatCard title="Setores monitorados" value="12" description="Telemetria sincronizada" />
        <StatCard title="Taxa de sucesso" value="94%" description="Ultimos 30 ciclos" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Cadastrar missao (fake)</CardTitle>
          <CardDescription>Selecione astronauta da API e adicione varios suprimentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreateMission} className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Nome da missao"
              value={missionForm.nome}
              onChange={(event) => onChangeForm((current) => ({ ...current, nome: event.target.value }))}
            />
            <Input
              placeholder="Setor"
              value={missionForm.setor}
              onChange={(event) => onChangeForm((current) => ({ ...current, setor: event.target.value }))}
            />
            <select
              value={missionForm.astronautId}
              onChange={(event) => onChangeForm((current) => ({ ...current, astronautId: event.target.value }))}
              className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
            >
              <option value="">Selecione astronauta</option>
              {astronauts.map((astronaut) => (
                <option key={astronaut.id} value={astronaut.id}>
                  {astronaut.name} - {astronaut.role}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={missionForm.selectedSupplyId}
                onChange={(event) => onChangeForm((current) => ({ ...current, selectedSupplyId: event.target.value }))}
                className="h-10 flex-1 rounded-md border border-input bg-secondary px-3 text-sm"
              >
                <option value="">Selecione suprimento</option>
                {supplies.map((supply) => (
                  <option key={supply.id} value={supply.id}>
                    {supply.item}
                  </option>
                ))}
              </select>
              <Button type="button" variant="secondary" onClick={onAddSupply}>
                Adicionar
              </Button>
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-2">
              {missionForm.supplyIds.map((id) => {
                const label = supplies.find((item) => item.id === id)?.item ?? id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onRemoveSupply(id)}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs hover:bg-red-950/50"
                    title="Remover suprimento"
                  >
                    {label} x
                  </button>
                );
              })}
            </div>

            {missionError ? <p className="md:col-span-2 text-sm text-red-300">{missionError}</p> : null}

            <div className="md:col-span-2">
              <Button type="submit">Criar missao</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Mapa de missoes</CardTitle>
          <CardDescription>Visao consolidada das expedicoes marcianas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Missao</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="font-medium text-red-300">{mission.id}</TableCell>
                  <TableCell>{mission.nome}</TableCell>
                  <TableCell>{mission.setor}</TableCell>
                  <TableCell>
                    <Badge variant={mission.status === "Ativa" ? "default" : "secondary"}>{mission.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{mission.astronautName}</p>
                      <p className="text-xs">{mission.supplyNames.join(", ") || "Sem suprimentos"}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
