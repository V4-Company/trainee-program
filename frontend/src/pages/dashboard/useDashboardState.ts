import { type FormEvent, useEffect, useMemo, useState } from "react";
import { createAstronaut, fetchAstronauts, softDeleteAstronaut, updateAstronaut } from "../../api/astronauts";
import {
  astronautNationalities,
  astronautRoles,
  missions as initialMissions,
  supplies as initialSupplies,
  supplyCategories
} from "../../data/fake-data";
import type { Astronaut } from "../../types/astronaut";
import type { AstronautFormState, Mission, MissionFormState, Supply, SupplyFormState } from "./types";

function createInitialAstronautForm(): AstronautFormState {
  return {
    name: "",
    role: astronautRoles[0],
    nationality: astronautNationalities[0],
    status: "active"
  };
}

function createInitialSupplyForm(): SupplyFormState {
  return { item: "", categoria: supplyCategories[0], estoque: "50" };
}

function createInitialMissionForm(): MissionFormState {
  return { nome: "", setor: "", astronautId: "", selectedSupplyId: "", supplyIds: [] };
}

export function useDashboardState() {
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  const [searchAstronaut, setSearchAstronaut] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [astronautError, setAstronautError] = useState("");
  const [isLoadingAstronauts, setIsLoadingAstronauts] = useState(false);
  const [editingAstronautId, setEditingAstronautId] = useState<number | null>(null);
  const [astronautForm, setAstronautForm] = useState<AstronautFormState>(createInitialAstronautForm());

  const [supplies, setSupplies] = useState<Supply[]>(initialSupplies);
  const [supplyForm, setSupplyForm] = useState<SupplyFormState>(createInitialSupplyForm());
  const [supplyError, setSupplyError] = useState("");

  const [missions, setMissions] = useState<Mission[]>(
    initialMissions.map((item) => ({
      id: item.id,
      nome: item.nome,
      setor: item.setor,
      status: item.status,
      astronautId: null,
      supplyIds: []
    }))
  );
  const [missionForm, setMissionForm] = useState<MissionFormState>(createInitialMissionForm());
  const [missionError, setMissionError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchAstronaut.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchAstronaut]);

  useEffect(() => {
    async function loadAstronauts() {
      setIsLoadingAstronauts(true);
      setAstronautError("");
      try {
        const response = await fetchAstronauts({ page: 1, limit: 50, search: debouncedSearch || undefined });
        setAstronauts(response.data);
      } catch (error) {
        setAstronautError(error instanceof Error ? error.message : "Falha ao buscar astronautas.");
      } finally {
        setIsLoadingAstronauts(false);
      }
    }

    void loadAstronauts();
  }, [debouncedSearch]);

  const missionsWithLabels = useMemo(() => {
    return missions.map((mission) => {
      const astronautName = astronauts.find((item) => item.id === mission.astronautId)?.name ?? "Nao atribuido";
      const supplyNames = mission.supplyIds
        .map((id) => supplies.find((item) => item.id === id)?.item)
        .filter((value): value is string => Boolean(value));

      return { ...mission, astronautName, supplyNames };
    });
  }, [missions, astronauts, supplies]);

  async function refreshAstronauts() {
    const response = await fetchAstronauts({ page: 1, limit: 50, search: debouncedSearch || undefined });
    setAstronauts(response.data);
  }

  async function handleAstronautSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAstronautError("");
    try {
      if (editingAstronautId) {
        await updateAstronaut(editingAstronautId, astronautForm);
      } else {
        await createAstronaut({
          name: astronautForm.name,
          role: astronautForm.role,
          nationality: astronautForm.nationality
        });
      }
      setAstronautForm(createInitialAstronautForm());
      setEditingAstronautId(null);
      await refreshAstronauts();
    } catch (error) {
      setAstronautError(error instanceof Error ? error.message : "Falha ao salvar astronauta.");
    }
  }

  function startEditAstronaut(item: Astronaut) {
    setEditingAstronautId(item.id);
    setAstronautForm({
      name: item.name,
      role: item.role,
      nationality: item.nationality,
      status: item.status
    });
  }

  function cancelAstronautEdit() {
    setEditingAstronautId(null);
    setAstronautForm(createInitialAstronautForm());
  }

  async function handleDeleteAstronaut(id: number) {
    setAstronautError("");
    try {
      await softDeleteAstronaut(id);
      setAstronauts((current) => current.filter((item) => item.id !== id));
      if (editingAstronautId === id) {
        cancelAstronautEdit();
      }
    } catch (error) {
      setAstronautError(error instanceof Error ? error.message : "Falha ao deletar astronauta.");
    }
  }

  async function fakeCreateSupply() {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }

  async function fakeDeleteSupply() {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }

  async function handleCreateSupply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupplyError("");
    const estoque = Number(supplyForm.estoque);
    if (!supplyForm.item.trim() || !supplyForm.categoria.trim() || !Number.isFinite(estoque)) {
      setSupplyError("Preencha item, categoria e estoque validos.");
      return;
    }

    await fakeCreateSupply();
    setSupplies((current) => [
      {
        id: `SUP-${Math.floor(Math.random() * 900 + 100)}`,
        item: supplyForm.item.trim(),
        categoria: supplyForm.categoria.trim(),
        estoque: Math.max(0, Math.min(100, estoque)),
        unidade: "%"
      },
      ...current
    ]);
    setSupplyForm(createInitialSupplyForm());
  }

  async function handleDeleteSupply(id: string) {
    await fakeDeleteSupply();
    setSupplies((current) => current.filter((item) => item.id !== id));
    setMissionForm((current) => ({
      ...current,
      supplyIds: current.supplyIds.filter((supplyId) => supplyId !== id),
      selectedSupplyId: current.selectedSupplyId === id ? "" : current.selectedSupplyId
    }));
  }

  function addMissionSupply() {
    if (!missionForm.selectedSupplyId) return;
    setMissionForm((current) => ({
      ...current,
      supplyIds: current.supplyIds.includes(current.selectedSupplyId)
        ? current.supplyIds
        : [...current.supplyIds, current.selectedSupplyId],
      selectedSupplyId: ""
    }));
  }

  function removeMissionSupply(id: string) {
    setMissionForm((current) => ({
      ...current,
      supplyIds: current.supplyIds.filter((item) => item !== id)
    }));
  }

  function handleCreateMission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMissionError("");
    if (!missionForm.nome.trim() || !missionForm.setor.trim() || !missionForm.astronautId || missionForm.supplyIds.length === 0) {
      setMissionError("Preencha nome, setor, astronauta e ao menos um suprimento.");
      return;
    }

    const newMission: Mission = {
      id: `MS-${Math.floor(Math.random() * 900 + 100)}`,
      nome: missionForm.nome.trim(),
      setor: missionForm.setor.trim(),
      status: "Planejamento",
      astronautId: Number(missionForm.astronautId),
      supplyIds: missionForm.supplyIds
    };

    setMissions((current) => [newMission, ...current]);
    setMissionForm(createInitialMissionForm());
  }

  return {
    astronauts,
    searchAstronaut,
    astronautError,
    isLoadingAstronauts,
    editingAstronautId,
    astronautForm,
    setAstronautForm,
    startEditAstronaut,
    cancelAstronautEdit,
    handleAstronautSubmit,
    handleDeleteAstronaut,
    setSearchAstronaut,
    supplies,
    supplyForm,
    setSupplyForm,
    supplyError,
    handleCreateSupply,
    handleDeleteSupply,
    missionsWithLabels,
    missionForm,
    setMissionForm,
    missionError,
    addMissionSupply,
    removeMissionSupply,
    handleCreateMission
  };
}
