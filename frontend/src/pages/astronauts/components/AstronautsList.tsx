import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { CardContent } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import type { AstronautsListProps } from "../../../types/astronaut";

export function AstronautsList({ isLoading, rows, onEdit, onDelete }: AstronautsListProps) {
  return (
    <CardContent>
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
  );
}
