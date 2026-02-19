import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MissionsPage } from "./pages/missions/MissionsPage";
import { SuppliesPage } from "./pages/supplies/SuppliesPage";
import { AstronautsPage } from "./pages/astronauts/AstronautsPage";
import { AppLayout } from "./layouts/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/missions" replace />} />
          <Route path="missions" element={<MissionsPage />} />
          <Route path="astronautas" element={<AstronautsPage />} />
          <Route path="suprimentos" element={<SuppliesPage />} />
          <Route path="*" element={<Navigate to="/missions" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;