import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "../../../components/ui/button";
import { CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { AstronautFormState } from "../../../types/astronaut";

interface AstronautFormProps {
  form: AstronautFormState;
  roles: string[];
  nationalities: string[];
  isEditing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onChangeForm: Dispatch<SetStateAction<AstronautFormState>>;
  onCancelEdit: () => void;
}

export function AstronautForm({
  form,
  roles,
  nationalities,
  isEditing,
  onSubmit,
  onChangeForm,
  onCancelEdit
}: AstronautFormProps) {
  return (
    <CardContent className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-2 md:grid-cols-4">
        <Input
          placeholder="Nome"
          value={form.name}
          onChange={(event) => onChangeForm((current) => ({ ...current, name: event.target.value }))}
        />
        <select
          value={form.role}
          onChange={(event) => onChangeForm((current) => ({ ...current, role: event.target.value }))}
          className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <select
          value={form.nationality}
          onChange={(event) => onChangeForm((current) => ({ ...current, nationality: event.target.value }))}
          className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
        >
          {nationalities.map((nationality) => (
            <option key={nationality} value={nationality}>
              {nationality}
            </option>
          ))}
        </select>
        <select
          value={form.status}
          onChange={(event) => onChangeForm((current) => ({ ...current, status: event.target.value as "active" | "inactive" }))}
          className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>

        <div className="md:col-span-4 flex gap-2">
          <Button type="submit">{isEditing ? "Atualizar astronauta" : "Adicionar astronauta"}</Button>
          {isEditing ? (
            <Button type="button" variant="secondary" onClick={onCancelEdit}>
              Cancelar edicao
            </Button>
          ) : null}
        </div>
      </form>

    </CardContent>
  );
}
