import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { useAuth } from "./lib/auth";
import { Agenda } from "./pages/Agenda";
import { Campanha } from "./pages/Campanha";
import { Estudos } from "./pages/Estudos";
import { Inicio } from "./pages/Inicio";
import { Login } from "./pages/Login";
import { Sugestoes } from "./pages/Sugestoes";

export function App() {
  return (
    <Routes>
      <Route path="/entrar" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Shell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Inicio />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/sugestoes" element={<Sugestoes />} />
        <Route path="/campanha" element={<Campanha />} />
        <Route path="/estudos" element={<Estudos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream text-deep">
        Abrindo o manancial...
      </div>
    );
  }
  if (!user) return <Navigate to="/entrar" replace />;
  return children;
}
