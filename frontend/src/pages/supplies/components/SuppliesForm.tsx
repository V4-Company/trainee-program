import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { SuppliesPageProps } from "../../../types/supplies";

type SuppliesFormProps = Omit<SuppliesPageProps, "rows">;

export function SuppliesForm({
  form,
  supplyError,
  categories,
  onChangeForm,
  onCreateSupply
}: SuppliesFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Cadastrar suprimento (fake)</CardTitle>
        <CardDescription>Fluxo frontend pronto, sem chamada para API.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onCreateSupply} className="grid gap-2 md:grid-cols-4">
          <Input
            placeholder="Item"
            value={form.item}
            onChange={(event) => onChangeForm((current) => ({ ...current, item: event.target.value }))}
          />
          <select
            value={form.categoria}
            onChange={(event) => onChangeForm((current) => ({ ...current, categoria: event.target.value }))}
            className="h-10 rounded-md border border-input bg-secondary px-3 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Input
            placeholder="Estoque (%)"
            type="number"
            value={form.estoque}
            onChange={(event) => onChangeForm((current) => ({ ...current, estoque: event.target.value }))}
          />
          <Button type="submit">Adicionar suprimento</Button>
        </form>
        {supplyError ? <p className="mt-2 text-sm text-red-300">{supplyError}</p> : null}
      </CardContent>
    </Card>
  );
}
