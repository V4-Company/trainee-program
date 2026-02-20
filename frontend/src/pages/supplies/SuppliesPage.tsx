import { type SubmitEventHandler, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupply, deleteSupply, fetchSupplies } from "../../api/supplies";
import { supplyCategories } from "../../data/fake-data";
import type { Supply, SupplyFormState } from "../../types/supplies";
import { SuppliesForm } from "./components/SuppliesForm";
import { SuppliesList } from "./components/SuppliesList";

const INITIAL_FORM: SupplyFormState = {
  item: "",
  categoria: supplyCategories[0],
  estoque: "50"
};

export function SuppliesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SupplyFormState>(INITIAL_FORM);
  const [supplyError, setSupplyError] = useState("");

  const suppliesQuery = useQuery({
    queryKey: ["supplies"],
    queryFn: fetchSupplies
  });

  const createSupplyMutation = useMutation({
    mutationFn: createSupply,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["supplies"] });
    }
  });

  const deleteSupplyMutation = useMutation({
    mutationFn: deleteSupply,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["supplies"] });
    }
  });

  const onCreateSupply: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSupplyError("");
    const estoque = Number(form.estoque);

    if (!form.item.trim() || !form.categoria.trim() || !Number.isFinite(estoque)) {
      setSupplyError("Preencha item, categoria e estoque validos.");
      return;
    }

    try {
      await createSupplyMutation.mutateAsync({
        item: form.item.trim(),
        categoria: form.categoria.trim(),
        estoque
      });
      setForm(INITIAL_FORM);
    } catch (error) {
      setSupplyError(error instanceof Error ? error.message : "Falha ao adicionar suprimento.");
    }
  };

  async function onDeleteSupply(id: string) {
    setSupplyError("");
    try {
      await deleteSupplyMutation.mutateAsync(id);
    } catch (error) {
      setSupplyError(error instanceof Error ? error.message : "Falha ao remover suprimento.");
    }
  }

  const rows: Supply[] = suppliesQuery.data ?? [];
  const resolvedSupplyError = supplyError || (suppliesQuery.error instanceof Error ? suppliesQuery.error.message : "");

  return (
    <div className="space-y-5">
      <SuppliesForm
        form={form}
        supplyError={resolvedSupplyError}
        categories={supplyCategories}
        onChangeForm={setForm}
        onCreateSupply={onCreateSupply}
      />
      <SuppliesList rows={rows} onDeleteSupply={onDeleteSupply} />
    </div>
  );
}
