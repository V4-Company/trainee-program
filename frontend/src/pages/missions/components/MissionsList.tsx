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
              <TableHead>Astronauta</TableHead>
              <TableHead>Suprimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium text-red-300">{mission.id}</TableCell>
                <TableCell>{mission.nome}</TableCell>
                <TableCell>{mission.astronautName}</TableCell>
                <TableCell>{mission.supplyName || "Sem suprimento"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
