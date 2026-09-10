import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { InkLogo } from "./Logo";

const links = [
  { to: "/", label: "Início" },
  { to: "/agenda", label: "Agenda" },
  { to: "/sugestoes", label: "Sugestões" },
  { to: "/campanha", label: "Campanha" },
  { to: "/estudos", label: "Estudos" },
];

export function Shell() {
  const { user, signOut, demo } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-deep/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <InkLogo />
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-deep">{user?.full_name}</p>
              <p className="text-[11px] uppercase tracking-wider text-mist">
                {user?.role === "lider" ? "Liderança" : "Jovem"}
                {demo ? " · demo" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await signOut();
                navigate("/entrar");
              }}
              className="rounded-full border border-deep/15 px-3 py-1.5 text-sm text-deep hover:bg-foam"
            >
              Sair
            </button>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-5xl gap-1 px-4 pb-3 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-deep text-cream" : "text-deep/70 hover:bg-foam"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:pb-12">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-deep/10 bg-cream/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-2xl px-1 py-2 text-center text-[11px] font-semibold ${
                  isActive ? "bg-deep text-cream" : "text-deep/70"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
