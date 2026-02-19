import { Boxes, Fuel, Rocket } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { astronautNationalities, astronautRoles, supplyCategories } from "../../data/fake-data";
import { SidebarButton } from "./components/SidebarButton";
import { AstronautsPage } from "./pages/AstronautsPage";
import { MissionsPage } from "./pages/MissionsPage";
import { SuppliesPage } from "./pages/SuppliesPage";
import type { Section } from "./types";
import { useDashboardState } from "./useDashboardState";

function resolveSection(pathname: string): Section {
  if (pathname.startsWith("/astronautas")) return "astronauts";
  if (pathname.startsWith("/suprimentos")) return "supplies";
  return "missions";
}

export function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = resolveSection(location.pathname);

  const state = useDashboardState();

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
            <SidebarButton
              label="Missoes"
              icon={<Rocket className="h-4 w-4" />}
              active={section === "missions"}
              onClick={() => navigate("/missoes")}
            />
            <SidebarButton
              label="Astronautas"
              icon={<Boxes className="h-4 w-4" />}
              active={section === "astronauts"}
              onClick={() => navigate("/astronautas")}
            />
            <SidebarButton
              label="Suprimentos"
              icon={<Fuel className="h-4 w-4" />}
              active={section === "supplies"}
              onClick={() => navigate("/suprimentos")}
            />
          </nav>

          <Separator className="my-6" />

          <Card className="bg-card/70">
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
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Interface futuristica</p>
              <h2 className="mt-1 text-3xl font-semibold">
                {section === "missions" && "Missoes"}
                {section === "astronauts" && "Astronautas"}
                {section === "supplies" && "Suprimentos"}
              </h2>
            </div>
            <Badge variant="secondary" className="bg-red-950/50 text-red-200">
              APIs: Astronautas | Fake: Missoes e Suprimentos
            </Badge>
          </div>

          {section === "missions" && (
            <MissionsPage
              astronauts={state.astronauts}
              missionError={state.missionError}
              missionForm={state.missionForm}
              missions={state.missionsWithLabels}
              onAddSupply={state.addMissionSupply}
              onChangeForm={state.setMissionForm}
              onCreateMission={state.handleCreateMission}
              onRemoveSupply={state.removeMissionSupply}
              supplies={state.supplies}
            />
          )}

          {section === "astronauts" && (
            <AstronautsPage
              astronautError={state.astronautError}
              form={state.astronautForm}
              isEditing={Boolean(state.editingAstronautId)}
              isLoading={state.isLoadingAstronauts}
              onChangeForm={state.setAstronautForm}
              onDelete={state.handleDeleteAstronaut}
              onEdit={state.startEditAstronaut}
              onSearchChange={state.setSearchAstronaut}
              onSubmit={state.handleAstronautSubmit}
              nationalities={astronautNationalities}
              roles={astronautRoles}
              rows={state.astronauts}
              search={state.searchAstronaut}
              onCancelEdit={state.cancelAstronautEdit}
            />
          )}

          {section === "supplies" && (
            <SuppliesPage
              form={state.supplyForm}
              onChangeForm={state.setSupplyForm}
              onCreateSupply={state.handleCreateSupply}
              onDeleteSupply={state.handleDeleteSupply}
              categories={supplyCategories}
              rows={state.supplies}
              supplyError={state.supplyError}
            />
          )}
        </main>
      </div>
    </div>
  );
}
