import { useMemo, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAstronauts } from "../../api/astronauts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import type { Astronaut } from "../../types/astronaut";
import type { Mission, MissionFormState } from "../../types/missions";
import { MissionForm } from "./components/MissionForm";
import { MissionsList } from "./components/MissionsList";

const INITIAL_MISSIONS: Mission[] = [
  { id: "MS-01", nome: "Aurora Rubra", setor: "Vallis Marineris", status: "Ativa", astronautId: null, supplyId: null },
  { id: "MS-02", nome: "Crimson Relay", setor: "Olympus Mons", status: "Planejamento", astronautId: null, supplyId: null },
  { id: "MS-03", nome: "Helios Forge", setor: "Elysium Planitia", status: "Ativa", astronautId: null, supplyId: null }
];

const SUPPLY_OPTIONS = [
  { id: "SUP-100", item: "Oxigenio liquido" },
  { id: "SUP-214", item: "Combustivel ionico" },
  { id: "SUP-332", item: "Kits medicos" },
  { id: "SUP-410", item: "Racao liofilizada" },
  { id: "SUP-512", item: "Filtros de poeira" }
];

const INITIAL_FORM: MissionFormState = {
  nome: "",
  setor: "",
  astronautId: "",
  supplyId: ""
};

export function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [missionForm, setMissionForm] = useState<MissionFormState>(INITIAL_FORM);
  const [missionError, setMissionError] = useState("");

  const astronautsQuery = useQuery({
    queryKey: ["astronaut-options"],
    queryFn: () => fetchAstronauts({ page: 1, limit: 50 })
  });

  const astronauts: Astronaut[] = astronautsQuery.data?.data ?? [];

  const missionsWithLabels = useMemo(() => {
    return missions.map((mission) => {
      const astronautName = astronauts.find((item) => item.id === mission.astronautId)?.name ?? "Nao atribuido";
      const supplyName = SUPPLY_OPTIONS.find((item) => item.id === mission.supplyId)?.item ?? "";
      return { ...mission, astronautName, supplyName };
    });
  }, [astronauts, missions]);

  function onFormChange(updater: (current: MissionFormState) => MissionFormState) {
    setMissionForm((current) => updater(current));
  }

  function onCreateMission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMissionError("");

    if (!missionForm.nome.trim() || !missionForm.setor.trim() || !missionForm.astronautId || !missionForm.supplyId) {
      setMissionError("Preencha nome, setor, astronauta e suprimento.");
      return;
    }

    setMissions((current) => [
      {
        id: `MS-${Math.floor(Math.random() * 900 + 100)}`,
        nome: missionForm.nome.trim(),
        setor: missionForm.setor.trim(),
        status: "Planejamento",
        astronautId: Number(missionForm.astronautId),
        supplyId: missionForm.supplyId
      },
      ...current
    ]);
    setMissionForm(INITIAL_FORM);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Missoes ativas" value={String(missions.filter((item) => item.status === "Ativa").length)} description="Operacao em tempo real" />
        <StatsCard title="Setores monitorados" value="12" description="Telemetria sincronizada" />
        <StatsCard title="Taxa de sucesso" value="94%" description="Ultimos 30 ciclos" />
      </div>

      <MissionForm
        form={missionForm}
        missionError={missionError || (astronautsQuery.error instanceof Error ? astronautsQuery.error.message : "")}
        astronauts={astronauts}
        supplies={SUPPLY_OPTIONS}
        onFormChange={onFormChange}
        onSubmit={onCreateMission}
      />

      <MissionsList missions={missionsWithLabels} />
    </div>
  );
}

function StatsCard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <Card className="bg-card/95">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl text-red-300">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
