import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";
import { useAuth } from "../lib/auth";

type Mode = "entrar" | "criar";

export function Login() {
  const { user, loading, demo, signIn, signUp, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setConfirm("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "entrar") {
        await signIn(email, password);
        navigate("/");
      } else {
        const { needsEmailConfirmation } = await signUp(email, password, confirm);
        if (needsEmailConfirmation) {
          switchMode("entrar");
          setNotice(
            "Conta criada! Abra o seu Gmail e clique no link de confirmação. Depois entre aqui com a sua senha.",
          );
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo deu errado. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-full border border-cream/20 bg-white/10 px-5 py-3.5 text-sm font-medium text-cream outline-none placeholder:text-foam/50 focus:border-gold";

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
            turma. Entre com o seu Gmail e a sua senha.
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1">
            <button
              type="button"
              onClick={() => switchMode("entrar")}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
                mode === "entrar" ? "bg-cream text-deep" : "text-foam/80"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchMode("criar")}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
                mode === "criar" ? "bg-cream text-deep" : "text-foam/80"
              }`}
            >
              Criar conta
            </button>
          </div>

          {error && (
            <p className="rounded-2xl bg-red-500/15 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-2xl bg-leaf/20 px-4 py-3 text-sm text-foam">
              {notice}
            </p>
          )}

          <form onSubmit={submit} className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.18em] text-gold">
              Seu Gmail
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="seu.nome@gmail.com"
                className={inputClass}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.18em] text-gold">
              {mode === "criar" ? "Crie uma senha" : "Sua senha"}
              <input
                type="password"
                name="password"
                autoComplete={mode === "criar" ? "new-password" : "current-password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={mode === "criar" ? "mínimo 6 caracteres" : "sua senha"}
                className={inputClass}
              />
            </label>
            {mode === "criar" && (
              <label className="block text-xs uppercase tracking-[0.18em] text-gold">
                Repita a senha
                <input
                  type="password"
                  name="confirm"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                  placeholder="a mesma senha"
                  className={inputClass}
                />
              </label>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-cream px-5 py-3.5 text-sm font-semibold text-deep disabled:opacity-70"
            >
              {busy
                ? mode === "criar"
                  ? "Criando conta..."
                  : "Entrando..."
                : mode === "criar"
                  ? "Criar conta"
                  : "Entrar"}
            </button>
          </form>

          {demo && (
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
          )}
          <p className="pt-2 text-center text-[11px] tracking-wide text-mist">
            Assembleia de Deus · ADESA 829
          </p>
        </div>
      </div>
    </div>
  );
}
