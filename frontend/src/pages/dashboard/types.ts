import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Astronaut } from "../../types/astronaut";

export type Section = "missions" | "astronauts" | "supplies";

export interface AstronautFormState {
  name: string;
  role: string;
  nationality: string;
  status: "active" | "inactive";
}

export interface SupplyFormState {
  item: string;
  categoria: string;
  estoque: string;
}

export interface Supply {
  id: string;
  item: string;
  categoria: string;
  estoque: number;
  unidade: string;
}

export interface MissionFormState {
  nome: string;
  setor: string;
  astronautId: string;
  selectedSupplyId: string;
  supplyIds: string[];
}

export interface Mission {
  id: string;
  nome: string;
  setor: string;
  status: string;
  astronautId: number | null;
  supplyIds: string[];
}

export interface MissionWithLabels extends Mission {
  astronautName: string;
  supplyNames: string[];
}

export interface AstronautsPageProps {
  astronautError: string;
  isLoading: boolean;
  isEditing: boolean;
  form: AstronautFormState;
  search: string;
  onSearchChange: (value: string) => void;
  rows: Astronaut[];
  roles: string[];
  nationalities: string[];
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onChangeForm: Dispatch<SetStateAction<AstronautFormState>>;
  onEdit: (item: Astronaut) => void;
  onDelete: (id: number) => Promise<void>;
  onCancelEdit: () => void;
}

export interface MissionsPageProps {
  missions: MissionWithLabels[];
  missionForm: MissionFormState;
  supplies: Array<{ id: string; item: string }>;
  astronauts: Astronaut[];
  missionError: string;
  onChangeForm: Dispatch<SetStateAction<MissionFormState>>;
  onAddSupply: () => void;
  onRemoveSupply: (id: string) => void;
  onCreateMission: (event: FormEvent<HTMLFormElement>) => void;
}

export interface SuppliesPageProps {
  rows: Supply[];
  form: SupplyFormState;
  supplyError: string;
  categories: string[];
  onChangeForm: Dispatch<SetStateAction<SupplyFormState>>;
  onCreateSupply: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onDeleteSupply: (id: string) => Promise<void>;
}
