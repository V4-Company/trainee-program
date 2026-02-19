import { type FormEvent, useState } from "react";
import { supplyCategories, supplies as initialSupplies } from "../../data/fake-data";
import type { Supply, SupplyFormState } from "../../types/supplies";
import { SuppliesForm } from "./components/SuppliesForm";
import { SuppliesList } from "./components/SuppliesList";

const INITIAL_FORM: SupplyFormState = {
  item: "",
  categoria: supplyCategories[0],
  estoque: "50"
};

export function SuppliesPage() {
  const [rows, setRows] = useState<Supply[]>(initialSupplies);
  const [form, setForm] = useState<SupplyFormState>(INITIAL_FORM);
  const [supplyError, setSupplyError] = useState("");

  async function fakeCreateSupply() {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }

  async function fakeDeleteSupply() {
    await new Promise((resolve) => window.setTimeout(resolve, 250));
  }

  async function onCreateSupply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupplyError("");
    const estoque = Number(form.estoque);

    if (!form.item.trim() || !form.categoria.trim() || !Number.isFinite(estoque)) {
      setSupplyError("Preencha item, categoria e estoque validos.");
      return;
    }

    await fakeCreateSupply();
    setRows((current) => [
      {
        id: `SUP-${Math.floor(Math.random() * 900 + 100)}`,
        item: form.item.trim(),
        categoria: form.categoria.trim(),
        estoque: Math.max(0, Math.min(100, estoque)),
        unidade: "%"
      },
      ...current
    ]);
    setForm(INITIAL_FORM);
  }

  async function onDeleteSupply(id: string) {
    await fakeDeleteSupply();
    setRows((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <SuppliesForm
        form={form}
        supplyError={supplyError}
        categories={supplyCategories}
        onChangeForm={setForm}
        onCreateSupply={onCreateSupply}
      />
      <SuppliesList rows={rows} onDeleteSupply={onDeleteSupply} />
    </div>
  );
}
