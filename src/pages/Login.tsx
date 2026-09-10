import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../lib/auth";

export function Login() {
  const { user, loading, demo, signInWithGoogle, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  async function google() {
    setError("");
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar com o Gmail.");
      setBusy(false);
    }
  }

  return (
    <div className="water-bg relative min-h-screen overflow-hidden text-cream">
      <div className="ripple-ring left-1/2 top-[42%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2" />
      <div
        className="ripple-ring left-1/2 top-[42%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2"
        style={{ animationDelay: "2.2s" }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-between px-6 py-10">
        <Logo />

        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-gold">
            Águas vivas para esta geração
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95]">
            O manancial
            <span className="italic text-gold"> da juventude</span>
          </h1>
          <p className="mt-5 max-w-sm text-base text-foam/85">
            Agenda, campanha, temas de estudo e um espaço para as ideias da
            turma. Entre com o Gmail e caminhe com a gente.
          </p>
        </div>

        <div className="space-y-3">
          {error && (
            <p className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={google}
            disabled={busy || demo}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-cream px-5 py-3.5 text-sm font-semibold text-deep disabled:opacity-70"
          >
            <GoogleMark />
            {busy ? "Abrindo o Google..." : "Entrar com Gmail"}
          </button>
          {demo && (
            <>
              <p className="text-center text-xs text-foam/70">
                O Supabase ainda não está ligado neste ambiente. Você pode
                explorar o portal em modo demonstração.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    enterDemo("jovem");
                    navigate("/");
                  }}
                  className="rounded-full border border-cream/25 px-4 py-3 text-sm font-medium text-cream"
                >
                  Entrar como jovem
                </button>
                <button
                  type="button"
                  onClick={() => {
                    enterDemo("lider");
                    navigate("/");
                  }}
                  className="rounded-full border border-gold/50 bg-gold/15 px-4 py-3 text-sm font-medium text-gold"
                >
                  Entrar como líder
                </button>
              </div>
            </>
          )}
          <p className="pt-2 text-center text-[11px] tracking-wide text-mist">
            Assembleia de Deus · ADESA 829
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.2 2.8-2.6 3.6v3h4.2c2.4-2.2 3.4-5.4 3.4-8.7z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.5 0 6.4-1.2 8.5-3.1l-4.2-3c-1.1.8-2.6 1.3-4.3 1.3-3.3 0-6.1-2.2-7.1-5.2H.6v3.1C2.7 21.3 7 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M4.9 14c-.2-.8-.4-1.6-.4-2.4s.1-1.6.4-2.4V6.1H.6C.2 7.9 0 9.9 0 12s.2 4.1.6 5.9l4.3-3.9z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.9 0 3.6.7 4.9 1.9l3.7-3.7C18.4 1 15.5 0 12 0 7 0 2.7 2.7.6 6.1l4.3 3.1C5.9 7 8.7 4.8 12 4.8z"
      />
    </svg>
  );
}
