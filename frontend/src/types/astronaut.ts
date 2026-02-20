import type { Dispatch, SetStateAction, SubmitEventHandler } from "react";

export interface Astronaut {
  id: number;
  name: string;
  role: string;
  nationality: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface AstronautsResponse {
  data: Astronaut[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateAstronautInput {
  name: string;
  role: string;
  nationality: string;
}

export interface UpdateAstronautInput {
  name?: string;
  role?: string;
  nationality?: string;
}

export interface AstronautFormState {
  name: string;
  role: string;
  nationality: string;
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
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  onChangeForm: Dispatch<SetStateAction<AstronautFormState>>;
  onSearchSubmit: SubmitEventHandler<HTMLFormElement>;
  onEdit: (item: Astronaut) => void;
  onDelete: (id: number) => Promise<void>;
  onCancelEdit: () => void;
}

export interface AstronautsListProps {
  isLoading: boolean;
  rows: Astronaut[];
  onEdit: (item: Astronaut) => void;
  onDelete: (id: number) => Promise<void>;
}