import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAstronaut, deleteAstronaut, fetchAstronauts, updateAstronaut } from "../../api/astronauts";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { astronautNationalities, astronautRoles } from "../../data/fake-data";
import type { Astronaut, AstronautFormState } from "../../types/astronaut";
import { AstronautForm } from "./components/AstronautForm";
import { AstronautsList } from "./components/AstronautsList";
import { AstronautSearch } from "./components/AstronautSearch";

const INITIAL_FORM: AstronautFormState = {
  name: "",
  role: astronautRoles[0],
  nationality: astronautNationalities[0]
};

export function AstronautsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AstronautFormState>(INITIAL_FORM);

  const astronautsQuery = useQuery({
    queryKey: ["astronauts", submittedSearch],
    queryFn: () => fetchAstronauts({ page: 1, limit: 50, search: submittedSearch || undefined })
  });

  const createMutation = useMutation({
    mutationFn: createAstronaut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["astronauts"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AstronautFormState }) => updateAstronaut(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["astronauts"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAstronaut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["astronauts"] });
    }
  });

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: form });
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          role: form.role,
          nationality: form.nationality
        });
      }
      setForm(INITIAL_FORM);
      setEditingId(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha ao salvar astronauta.");
    }
  }

  function onEdit(item: Astronaut) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      nationality: item.nationality
    });
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  async function onDelete(id: number) {
    setFormError("");
    try {
      await deleteMutation.mutateAsync(id);
      if (editingId === id) {
        onCancelEdit();
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha ao deletar astronauta.");
    }
  }

  const rows: Astronaut[] = astronautsQuery.data?.data ?? [];
  const isLoading = astronautsQuery.isPending;
  const astronautError = formError || (astronautsQuery.error instanceof Error ? astronautsQuery.error.message : "");

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Equipe de astronautas</CardTitle>
          <CardDescription>Gerencie a equipe de astronautas da missao.</CardDescription>
        </CardHeader>

        <AstronautForm
          form={form}
          roles={astronautRoles}
          nationalities={astronautNationalities}
          isEditing={Boolean(editingId)}
          onSubmit={onSubmit}
          onChangeForm={setForm}
          onCancelEdit={onCancelEdit}
        />

        <div className="px-6 py-4">
          <AstronautSearch search={search} onSearchChange={setSearch} onSearchSubmit={onSearchSubmit} />
          {astronautError ? <p className="mt-2 text-sm text-red-300">{astronautError}</p> : null}
        </div>

        <AstronautsList isLoading={isLoading} rows={rows} onEdit={onEdit} onDelete={onDelete} />
      </Card>
    </div>
  );
}
/* import { type FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAstronaut, deleteAstronaut, fetchAstronauts, updateAstronaut } from "../../api/astronauts";
import { Card, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { astronautNationalities, astronautRoles } from "../../data/fake-data";
import type { Astronaut, AstronautFormState } from "../../types/astronaut";
import { AstronautForm } from "./components/AstronautForm";
import { AstronautsList } from "./components/AstronautsList";
import { AstronautSearch } from "./components/AstronautSearch";

const INITIAL_FORM: AstronautFormState = {
  name: "",
  role: astronautRoles[0],
  nationality: astronautNationalities[0]
};

export function AstronautsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AstronautFormState>(INITIAL_FORM);

  const astronautsQuery = useQuery({
    queryKey: ["astronauts", submittedSearch],
    queryFn: () => fetchAstronauts({ page: 1, limit: 50, search: submittedSearch || undefined })
  });

  const createMutation = useMutation({
    mutationFn: createAstronaut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["astronauts"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AstronautFormState }) => updateAstronaut(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["astronauts"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAstronaut,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["astronauts"] });
    }
  });

  function onSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: form });
      } else {
        await createMutation.mutateAsync({
          name: form.name,
          role: form.role,
          nationality: form.nationality
        });
      }
      setForm(INITIAL_FORM);
      setEditingId(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha ao salvar astronauta.");
    }
  }

  function onEdit(item: Astronaut) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      nationality: item.nationality
    });
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  async function onDelete(id: number) {
    setFormError("");
    try {
      await deleteMutation.mutateAsync(id);
      if (editingId === id) {
        onCancelEdit();
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Falha ao deletar astronauta.");
    }
  }

  const rows: Astronaut[] = astronautsQuery.data?.data ?? [];
  const isLoading = astronautsQuery.isPending;
  const astronautError = formError || (astronautsQuery.error instanceof Error ? astronautsQuery.error.message : "");

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Equipe de astronautas</CardTitle>
          <CardDescription>Gerencie a equipe de astronautas da missao.</CardDescription>
        </CardHeader>

        <AstronautForm
          form={form}
          roles={astronautRoles}
          nationalities={astronautNationalities}
          isEditing={Boolean(editingId)}
          onSubmit={onSubmit}
          onChangeForm={setForm}
          onCancelEdit={onCancelEdit}
        />

        <div className="px-6 py-4">
          <AstronautSearch search={search} onSearchChange={setSearch} onSearchSubmit={onSearchSubmit} />
          {astronautError ? <p className="mt-2 text-sm text-red-300">{astronautError}</p> : null}
        </div>

        <AstronautsList isLoading={isLoading} rows={rows} onEdit={onEdit} onDelete={onDelete} />
      </Card>
    </div>
  );
}
*/
/*
import { type FormEvent, useEffect, useState } from "react";
import { createAstronaut, deleteAstronaut, fetchAstronauts, softDeleteAstronaut, updateAstronaut } from "../../api/astronauts";
import { Card, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { astronautNationalities, astronautRoles } from "../../data/fake-data";
import type { Astronaut, AstronautFormState } from "../../types/astronaut";
import { AstronautForm } from "./components/AstronautForm";
import { AstronautsList } from "./components/AstronautsList";
import { AstronautSearch } from "./components/AstronautSearch";

const INITIAL_FORM: AstronautFormState = {
  name: "",
  role: astronautRoles[0],
  nationality: astronautNationalities[0],
};

export function AstronautsPage() {
  const [rows, setRows] = useState<Astronaut[]>([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [astronautError, setAstronautError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AstronautFormState>(INITIAL_FORM);

  useEffect(() => {
    async function loadAstronauts() {
      setIsLoading(true);
      setAstronautError("");
      try {
        const response = await fetchAstronauts({ page: 1, limit: 50, search: submittedSearch || undefined });
        setRows(response.data);
      } catch (error) {
        setAstronautError(error instanceof Error ? error.message : "Falha ao buscar astronautas.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAstronauts();
  }, [submittedSearch]);

  async function refreshAstronauts() {
    const response = await fetchAstronauts({ page: 1, limit: 50, search: submittedSearch || undefined });
    setRows(response.data);
  }

  function onSearchSubmit(event: InputEvent) {
    event.preventDefault();
    setSubmittedSearch(search.trim());
  }

  async function onSubmit(event: InputEvent) {
    event.preventDefault();
    setAstronautError("");
    try {
      if (editingId) {
        await updateAstronaut(editingId, form);
      } else {
        await createAstronaut({
          name: form.name,
          role: form.role,
          nationality: form.nationality
        });
      }
      setForm(INITIAL_FORM);
      setEditingId(null);
      await refreshAstronauts();
    } catch (error) {
      setAstronautError(error instanceof Error ? error.message : "Falha ao salvar astronauta.");
    }
  }

  function onEdit(item: Astronaut) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      nationality: item.nationality,
    });
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(INITIAL_FORM);
  }

  async function onDelete(id: number) {
    setAstronautError("");

    try {
      await deleteAstronaut(id);

      setRows((current) => current.filter((item) => item.id !== id));

      if (editingId === id) {
        onCancelEdit();
      }

    } catch (error) {
      setAstronautError(error instanceof Error ? error.message : "Falha ao deletar astronauta.");
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Equipe de astronautas</CardTitle>
          <CardDescription>Gerencie a equipe de astronautas da missao.</CardDescription>
        </CardHeader>

        <AstronautForm
          form={form}
          roles={astronautRoles}
          nationalities={astronautNationalities}
          isEditing={Boolean(editingId)}
          onSubmit={onSubmit}
          onChangeForm={setForm}
          onCancelEdit={onCancelEdit}
        />

        <div className="px-6 py-4">
          <AstronautSearch search={search} onSearchChange={setSearch} onSearchSubmit={onSearchSubmit} />
          {astronautError ? <p className="mt-2 text-sm text-red-300">{astronautError}</p> : null}
        </div>

        <AstronautsList isLoading={isLoading} rows={rows} onEdit={onEdit} onDelete={onDelete} />
      </Card>
    </div>
  );
}
*/
