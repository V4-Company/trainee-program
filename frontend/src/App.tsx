import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/missoes" replace />} />
        <Route path="/missoes" element={<Dashboard />} />
        <Route path="/astronautas" element={<Dashboard />} />
        <Route path="/suprimentos" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/missoes" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;