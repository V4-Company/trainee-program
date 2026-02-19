import { Pencil, Search, Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import type { AstronautsPageProps } from "../types";

export function AstronautsPage({
  astronautError,
  isLoading,
  isEditing,
  form,
  search,
  onSearchChange,
  rows,
  roles,
  nationalities,
  onSubmit,
  onChangeForm,
  onEdit,
  onDelete,
  onCancelEdit
}: AstronautsPageProps) {
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Equipe de astronautas</CardTitle>
          <CardDescription>Criar, atualizar e deletar (soft delete) usando API real do backend.</CardDescription>
        </CardHeader>
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

          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar astronauta..."
              className="pl-9"
            />
          </div>
          {astronautError ? <p className="text-sm text-red-300">{astronautError}</p> : null}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Funcao</TableHead>
                <TableHead>Nacionalidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>Carregando astronautas...</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>Nenhum astronauta encontrado.</TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.role}</TableCell>
                    <TableCell>{item.nationality}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
                          <Pencil className="mr-1 h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => void onDelete(item.id)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          Deletar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
