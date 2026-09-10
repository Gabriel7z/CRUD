import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Countdown } from "../components/Countdown";
import {
  fetchCampaigns,
  fetchEvents,
  fetchStudies,
  hasRsvp,
  toggleRsvp,
} from "../lib/api";
import { useAuth } from "../lib/auth";
import { formatWhen, getNextEvent, progressPct } from "../lib/dates";
import type { Campaign, EventItem, StudyTheme } from "../lib/types";

export function Inicio() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [studies, setStudies] = useState<StudyTheme[]>([]);
  const [going, setGoing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchEvents(), fetchCampaigns(), fetchStudies()])
      .then(([nextEvents, nextCampaigns, nextStudies]) => {
        setEvents(nextEvents);
        setCampaigns(nextCampaigns);
        setStudies(nextStudies);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"));
  }, []);

  const next = getNextEvent(events);
  const campaign = campaigns[0];
  const study = studies[0];

  useEffect(() => {
    if (!next || !user) return;
    hasRsvp(next.id, user.id)
      .then(setGoing)
      .catch(() => setGoing(false));
  }, [next, user]);

  const greeting = new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.2em] text-spring">
          {greeting}, {user?.full_name.split(" ")[0]}
        </p>
        <h1 className="mt-1 font-display text-4xl text-deep">
          O próximo encontro já está no horizonte.
        </h1>
      </section>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {next ? (
        <article className="water-bg relative overflow-hidden rounded-[2rem] p-6 text-cream shadow-lg">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">
            Lembrete do próximo evento
          </p>
          <h2 className="mt-2 font-display text-3xl">{next.title}</h2>
          <p className="mt-2 text-foam/90">{formatWhen(next.starts_at)}</p>
          <p className="text-sm text-foam/75">{next.location}</p>
          <p className="mt-3 max-w-xl text-sm text-foam/80">{next.description}</p>
          <Countdown target={next.starts_at} />
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                if (!user) return;
                setGoing(await toggleRsvp(next.id, user.id));
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                going ? "bg-gold text-ink" : "bg-cream text-deep"
              }`}
            >
              {going ? "Você confirmou presença" : "Eu vou estar lá"}
            </button>
            <Link
              to="/agenda"
              className="rounded-full border border-cream/30 px-4 py-2 text-sm text-cream"
            >
              Ver agenda completa
            </Link>
          </div>
        </article>
      ) : (
        <article className="rounded-[2rem] bg-foam p-6">
          <p className="font-display text-2xl text-deep">Agenda em construção</p>
          <p className="mt-2 text-sm text-deep/70">
            Ainda não há um próximo evento marcado. Fique de olho.
          </p>
        </article>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {campaign && (
          <Link to="/campanha" className="rounded-[1.75rem] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Campanha</p>
            <h3 className="mt-2 font-display text-2xl text-deep">{campaign.title}</h3>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-foam">
              <div
                className="h-full rounded-full bg-spring"
                style={{ width: `${progressPct(campaign.current, campaign.goal)}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-mist">
              {progressPct(campaign.current, campaign.goal)}% do alvo
            </p>
          </Link>
        )}
        {study && (
          <Link to="/estudos" className="rounded-[1.75rem] bg-deep p-5 text-cream">
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Tema de estudo</p>
            <h3 className="mt-2 font-display text-2xl">{study.title}</h3>
            <p className="mt-3 text-sm italic text-foam/85">“{study.verse}”</p>
            <p className="mt-2 text-xs tracking-wide text-gold">{study.verse_ref}</p>
          </Link>
        )}
      </div>
    </div>
  );
}
