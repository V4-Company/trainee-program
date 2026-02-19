import { Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import type { SuppliesListProps } from "../../../types/supplies";

export function SuppliesList({ rows, onDeleteSupply }: SuppliesListProps) {
  return (
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
  );
}
