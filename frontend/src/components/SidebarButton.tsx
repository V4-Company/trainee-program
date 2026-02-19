import type { ReactNode } from "react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

interface SidebarButtonProps {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}

export function SidebarButton({ label, icon, active, onClick }: SidebarButtonProps) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      className={cn("w-full justify-start gap-3", !active && "text-muted-foreground")}
      onClick={onClick}
    >
      {icon}
      {label}
    </Button>
  );
}
