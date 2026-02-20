import { Boxes, Fuel, Rocket } from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { cn } from "../lib/utils";

const navItems = [
  { to: "/missions", label: "Missoes", icon: Rocket },
  { to: "/astronautas", label: "Astronautas", icon: Boxes },
  { to: "/suprimentos", label: "Suprimentos", icon: Fuel }
];

function resolveTitle(pathname: string): string {
  if (pathname.startsWith("/astronautas")) return "Astronautas";
  if (pathname.startsWith("/suprimentos")) return "Suprimentos";
  return "Missoes";
}

export function AppLayout() {
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="w-72 border-r border-border bg-secondary/40 px-5 py-6 backdrop-blur">
          <div className="mb-8 rounded-xl border border-border bg-card p-4 shadow-glow">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mars Mission</p>
            <h1 className="mt-2 text-2xl font-semibold">Control Hub</h1>
            <p className="mt-1 text-sm text-muted-foreground">Painel central da colonia marciana</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex h-10 w-full items-center gap-3 rounded-md px-4 text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <Card className="mt-6 bg-card/70">
            <CardHeader className="pb-3">
              <CardDescription>Estado da estacao</CardDescription>
              <CardTitle className="text-lg">Sistemas operacionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  Integridade <span className="text-red-400">98%</span>
                </p>
                <p className="flex items-center justify-between">
                  Energia <span className="text-red-300">81%</span>
                </p>
                <p className="flex items-center justify-between">
                  Rede <span className="text-red-200">Estavel</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 px-8 py-8">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">MARS MISSION CONTROL</p>
              <h2 className="mt-1 text-3xl font-semibold">{title}</h2>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
