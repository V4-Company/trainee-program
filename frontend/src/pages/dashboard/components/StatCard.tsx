import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card className="bg-card/95">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl text-red-300">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
