import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import type { MissionsListProps } from "../../../types/missions";

export function MissionsList({ missions }: MissionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mapa de missoes</CardTitle>
        <CardDescription>Visao consolidada das expedicoes marcianas.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Missao</TableHead>
              <TableHead>Setor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Contexto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium text-red-300">{mission.id}</TableCell>
                <TableCell>{mission.nome}</TableCell>
                <TableCell>{mission.setor}</TableCell>
                <TableCell>
                  <Badge variant={mission.status === "Ativa" ? "default" : "secondary"}>{mission.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{mission.astronautName}</p>
                    <p className="text-xs">{mission.supplyName || "Sem suprimento"}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
