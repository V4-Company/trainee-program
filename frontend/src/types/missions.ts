import type { FormEvent } from "react";
import type { Astronaut } from "./astronaut";

export interface MissionFormState {
  nome: string;
  setor: string;
  astronautId: string;
  supplyId: string;
}

export interface Mission {
  id: string;
  nome: string;
  setor: string;
  status: string;
  astronautId: number | null;
  supplyId: string | null;
}

export interface MissionWithLabels extends Mission {
  astronautName: string;
  supplyName: string;
}

export interface MissionFormProps {
  form: MissionFormState;
  missionError: string;
  astronauts: Astronaut[];
  supplies: Array<{ id: string; item: string }>;
  onFormChange: (updater: (current: MissionFormState) => MissionFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export interface MissionsListProps {
  missions: MissionWithLabels[];
}