import { FormEvent, useEffect, useState } from "react";
import { createStudy, fetchStudies } from "../lib/api";
import { useAuth } from "../lib/auth";
import { formatDay } from "../lib/dates";
import type { StudyTheme } from "../lib/types";

export function Estudos() {
  const { user } = useAuth();
  const [items, setItems] = useState<StudyTheme[]>([]);
  const [open, setOpen] = useState(false);
  const isLeader = user?.role === "lider";

  useEffect(() => {
    fetchStudies().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-spring">Palavra</p>
          <h1 className="font-display text-4xl text-deep">Temas de estudo</h1>
        </div>
        {isLeader && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-deep px-4 py-2 text-sm font-semibold text-cream"
          >
            Novo tema
          </button>
        )}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((theme) => (
          <article key={theme.id} className="rounded-[1.8rem] bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] text-gold">
              {formatDay(theme.study_date)}
            </p>
            <h2 className="mt-2 font-display text-3xl text-deep">{theme.title}</h2>
            <blockquote className="mt-4 border-l-2 border-gold pl-4 text-sm italic text-deep/80">
              {theme.verse}
            </blockquote>
            <p className="mt-2 text-xs font-semibold tracking-wide text-spring">
              {theme.verse_ref}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-deep/75">{theme.description}</p>
          </article>
        ))}
      </div>

      {open && (
        <StudyForm
          onClose={() => setOpen(false)}
          onCreate={(item) => {
            setItems((current) => [...current, item]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function StudyForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (item: StudyTheme) => void;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const created = await createStudy({
      title: String(form.get("title")),
      verse: String(form.get("verse")),
      verse_ref: String(form.get("verse_ref")),
      description: String(form.get("description")),
      study_date: new Date(String(form.get("study_date"))).toISOString(),
    });
    onCreate(created);
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-ink/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-[1.6rem] bg-cream p-5">
        <h3 className="font-display text-2xl text-deep">Novo tema</h3>
        <input name="title" required placeholder="Título" className="field" />
        <input name="verse_ref" required placeholder="Referência (ex: João 7:38)" className="field" />
        <textarea name="verse" required placeholder="Texto do versículo" className="field min-h-20" />
        <textarea name="description" required placeholder="Como vamos estudar" className="field min-h-24" />
        <input name="study_date" required type="datetime-local" className="field" />
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm">
            Cancelar
          </button>
          <button className="rounded-full bg-deep px-4 py-2 text-sm font-semibold text-cream">
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
