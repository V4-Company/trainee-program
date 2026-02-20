import type { SubmitEventHandler } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

interface AstronautSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: SubmitEventHandler<HTMLFormElement>;
}

export function AstronautSearch({ search, onSearchChange, onSearchSubmit }: AstronautSearchProps) {
  return (
    <form onSubmit={onSearchSubmit} className="relative max-w-md">
      <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar astronauta..."
        className="pl-9"
      />
    </form>
  );
}
