import { FormEvent, useEffect, useState } from "react";
import { createSuggestion, fetchSuggestions } from "../lib/api";
import { useAuth } from "../lib/auth";
import type { Suggestion } from "../lib/types";

export function Sugestoes() {
  const { user } = useAuth();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchSuggestions()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const created = await createSuggestion({
        title: String(data.get("title")),
        body: String(data.get("body")),
        author_name: user.full_name,
        author_id: user.id,
      });
      setItems((current) => [created, ...current]);
      form.reset();
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.22em] text-spring">Caixa da turma</p>
        <h1 className="font-display text-4xl text-deep">Sugestões</h1>
        <p className="mt-2 max-w-2xl text-sm text-deep/70">
          Ideias de culto, ação social, estudo ou lazer. A liderança lê tudo o
          que chega aqui.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-3 rounded-[1.7rem] bg-white p-5 shadow-sm">
        <input name="title" required placeholder="Um título curto" className="field" />
        <textarea
          name="body"
          required
          placeholder="Conta a ideia com um pouco mais de detalhe..."
          className="field min-h-28"
        />
        <div className="flex items-center justify-between">
          {sent ? <p className="text-sm text-spring">Sugestão enviada. Obrigado!</p> : <span />}
          <button className="rounded-full bg-deep px-5 py-2 text-sm font-semibold text-cream">
            Enviar
          </button>
        </div>
      </form>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-[1.5rem] border border-deep/10 p-5">
            <p className="text-xs uppercase tracking-wider text-mist">
              {item.author_name} ·{" "}
              {new Date(item.created_at).toLocaleDateString("pt-BR")}
            </p>
            <h2 className="mt-1 font-display text-2xl text-deep">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-deep/80">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
