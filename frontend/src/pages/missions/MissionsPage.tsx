import { type SubmitEventHandler, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAstronauts } from "../../api/astronauts";
import { createMission, fetchMissions } from "../../api/missions";
import { fetchSupplies } from "../../api/supplies";
import type { Astronaut } from "../../types/astronaut";
import type { Mission, MissionFormState } from "../../types/missions";
import { MissionForm } from "./components/MissionForm";
import { MissionsList } from "./components/MissionsList";

const INITIAL_FORM: MissionFormState = {
  nome: "",
  astronautId: "",
  supplyId: ""
};

export function MissionsPage() {
  const queryClient = useQueryClient();
  const [missionForm, setMissionForm] = useState<MissionFormState>(INITIAL_FORM);
  const [missionError, setMissionError] = useState("");

  const astronautsQuery = useQuery({
    queryKey: ["astronaut-options"],
    queryFn: () => fetchAstronauts({ page: 1, limit: 50 })
  });

  const astronauts: Astronaut[] = astronautsQuery.data?.data ?? [];
  const missionsQuery = useQuery({
    queryKey: ["missions"],
    queryFn: fetchMissions
  });

  const suppliesQuery = useQuery({
    queryKey: ["supplies"],
    queryFn: fetchSupplies
  });

  const createMissionMutation = useMutation({
    mutationFn: createMission,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["missions"] });
    }
  });

  const missions: Mission[] = missionsQuery.data ?? [];
  const supplyOptions = (suppliesQuery.data ?? []).map((supply) => ({ id: supply.id, item: supply.item }));

  const missionsWithLabels = useMemo(() => {
    return missions.map((mission) => {
      const astronautName = astronauts.find((item) => item.id === mission.astronautId)?.name ?? "Nao atribuido";
      const supplyName = supplyOptions.find((item) => item.id === mission.supplyId)?.item ?? "";
      return { ...mission, astronautName, supplyName };
    });
  }, [astronauts, missions, supplyOptions]);

  function onFormChange(updater: (current: MissionFormState) => MissionFormState) {
    setMissionForm((current) => updater(current));
  }

  const onCreateMission: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setMissionError("");

    if (!missionForm.nome.trim() || !missionForm.astronautId || !missionForm.supplyId) {
      setMissionError("Preencha nome, astronauta e suprimento.");
      return;
    }

    void createMissionMutation
      .mutateAsync({
        nome: missionForm.nome.trim(),
        astronautId: Number(missionForm.astronautId),
        supplyId: missionForm.supplyId
      })
      .then(() => {
        setMissionForm(INITIAL_FORM);
      })
      .catch((error: unknown) => {
        setMissionError(error instanceof Error ? error.message : "Falha ao criar missao.");
      });
  };

  const resolvedMissionError =
    missionError ||
    (astronautsQuery.error instanceof Error ? astronautsQuery.error.message : "") ||
    (missionsQuery.error instanceof Error ? missionsQuery.error.message : "") ||
    (suppliesQuery.error instanceof Error ? suppliesQuery.error.message : "");

  return (
    <div className="space-y-5">
      <MissionForm
        form={missionForm}
        missionError={resolvedMissionError}
        astronauts={astronauts}
        supplies={supplyOptions}
        onFormChange={onFormChange}
        onSubmit={onCreateMission}
      />

      <MissionsList missions={missionsWithLabels} />
    </div>
  );
}
