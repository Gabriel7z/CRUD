import { FormEvent, useEffect, useState } from "react";
import { fetchEvents, createEvent } from "../lib/api";
import { useAuth } from "../lib/auth";
import { formatWhen } from "../lib/dates";
import type { EventItem, EventKind } from "../lib/types";

const kindLabel: Record<EventKind, string> = {
  encontro: "Encontro",
  culto: "Culto",
  vigilia: "Vigília",
  futebol: "Futebol",
  festa: "Festa",
  outro: "Outro",
};

export function Agenda() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const isLeader = user?.role === "lider";

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro"));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-spring">Calendário</p>
          <h1 className="font-display text-4xl text-deep">Agenda dos jovens</h1>
        </div>
        {isLeader && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-deep px-4 py-2 text-sm font-semibold text-cream"
          >
            Novo encontro
          </button>
        )}
      </header>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <ul className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="rounded-[1.6rem] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-foam px-3 py-1 text-xs font-semibold uppercase tracking-wider text-spring">
                {kindLabel[event.kind]}
              </span>
              <span className="text-sm text-mist">{formatWhen(event.starts_at)}</span>
            </div>
            <h2 className="mt-2 font-display text-2xl text-deep">{event.title}</h2>
            <p className="mt-1 text-sm text-deep/70">{event.location}</p>
            <p className="mt-3 text-sm leading-relaxed text-deep/80">{event.description}</p>
          </li>
        ))}
      </ul>

      {open && (
        <EventForm
          onClose={() => setOpen(false)}
          onCreate={(event) => {
            setEvents((current) =>
              [...current, event].sort(
                (a, b) =>
                  new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
              ),
            );
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function EventForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (event: EventItem) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const created = await createEvent({
        title: String(form.get("title")),
        description: String(form.get("description")),
        starts_at: new Date(String(form.get("starts_at"))).toISOString(),
        location: String(form.get("location")),
        kind: String(form.get("kind")) as EventKind,
      });
      onCreate(created);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-ink/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md space-y-3 rounded-[1.6rem] bg-cream p-5"
      >
        <h3 className="font-display text-2xl text-deep">Novo encontro</h3>
        <input name="title" required placeholder="Título" className="field" />
        <input name="location" required placeholder="Local" className="field" />
        <input name="starts_at" required type="datetime-local" className="field" />
        <select name="kind" className="field">
          <option value="encontro">Encontro</option>
          <option value="culto">Culto</option>
          <option value="vigilia">Vigília</option>
          <option value="futebol">Futebol</option>
          <option value="festa">Festa</option>
          <option value="outro">Outro</option>
        </select>
        <textarea name="description" required placeholder="Detalhes" className="field min-h-24" />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm">
            Cancelar
          </button>
          <button
            disabled={busy}
            className="rounded-full bg-deep px-4 py-2 text-sm font-semibold text-cream"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
