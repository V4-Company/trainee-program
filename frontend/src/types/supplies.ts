import type { Dispatch, FormEvent, SetStateAction } from "react";

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
  
export interface SuppliesPageProps {
  rows: Supply[];
  form: SupplyFormState;
  supplyError: string;
  categories: string[];
  onChangeForm: Dispatch<SetStateAction<SupplyFormState>>;
  onCreateSupply: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface SuppliesListProps {
  rows: Supply[];
  onDeleteSupply: (id: string) => Promise<void>;
}