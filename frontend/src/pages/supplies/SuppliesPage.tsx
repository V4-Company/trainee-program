import { Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import type { SuppliesPageProps } from "../types";

export function SuppliesPage({
  rows,
  form,
  supplyError,
  categories,
  onChangeForm,
  onCreateSupply,
  onDeleteSupply
}: SuppliesPageProps) {
  return (
    <div className="space-y-5">
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

      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{item.item}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.id}</Badge>
                  <Button size="sm" variant="outline" onClick={() => void onDeleteSupply(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardDescription>{item.categoria}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nivel de estoque</span>
                  <span className="font-semibold text-red-300">
                    {item.estoque}
                    {item.unidade}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${item.estoque}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
