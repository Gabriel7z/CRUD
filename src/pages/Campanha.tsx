import { FormEvent, useEffect, useState } from "react";
import { createCampaign, fetchCampaigns } from "../lib/api";
import { useAuth } from "../lib/auth";
import { formatDay, progressPct, unitLabel } from "../lib/dates";
import type { Campaign, CampaignUnit } from "../lib/types";

export function Campanha() {
  const { user } = useAuth();
  const [items, setItems] = useState<Campaign[]>([]);
  const [open, setOpen] = useState(false);
  const isLeader = user?.role === "lider";

  useEffect(() => {
    fetchCampaigns().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-spring">Juntos</p>
          <h1 className="font-display text-4xl text-deep">Lugar de campanha</h1>
          <p className="mt-2 max-w-xl text-sm text-deep/70">
            Oração, oferta e missão. Acompanhe os alvos e ore com a turma.
          </p>
        </div>
        {isLeader && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-deep px-4 py-2 text-sm font-semibold text-cream"
          >
            Nova campanha
          </button>
        )}
      </header>

      <div className="space-y-4">
        {items.map((campaign) => {
          const pct = progressPct(campaign.current, campaign.goal);
          return (
            <article key={campaign.id} className="rounded-[1.8rem] bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="font-display text-3xl text-deep">{campaign.title}</h2>
                <span className="rounded-full bg-foam px-3 py-1 text-xs font-semibold text-spring">
                  até {formatDay(campaign.ends_at)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-deep/75">{campaign.description}</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-foam">
                <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-3 text-sm text-deep">
                {formatAmount(campaign.current, campaign.unit)} de{" "}
                {formatAmount(campaign.goal, campaign.unit)} · {pct}%
              </p>
            </article>
          );
        })}
      </div>

      {open && (
        <CampaignForm
          onClose={() => setOpen(false)}
          onCreate={(item) => {
            setItems((current) => [item, ...current]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function formatAmount(value: number, unit: CampaignUnit) {
  if (unit === "reais") {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  return `${value} ${unitLabel(unit)}`;
}

function CampaignForm({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (item: Campaign) => void;
}) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const created = await createCampaign({
      title: String(form.get("title")),
      description: String(form.get("description")),
      goal: Number(form.get("goal")),
      current: Number(form.get("current") || 0),
      unit: String(form.get("unit")) as CampaignUnit,
      ends_at: new Date(String(form.get("ends_at"))).toISOString(),
    });
    onCreate(created);
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-ink/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-[1.6rem] bg-cream p-5">
        <h3 className="font-display text-2xl text-deep">Nova campanha</h3>
        <input name="title" required placeholder="Título" className="field" />
        <textarea name="description" required placeholder="Por que essa campanha existe" className="field min-h-24" />
        <input name="goal" required type="number" min={1} placeholder="Alvo" className="field" />
        <input name="current" type="number" min={0} placeholder="Já alcançado" className="field" />
        <select name="unit" className="field">
          <option value="oracao">Orações / dias</option>
          <option value="reais">Reais</option>
          <option value="pessoas">Pessoas</option>
        </select>
        <input name="ends_at" required type="datetime-local" className="field" />
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
