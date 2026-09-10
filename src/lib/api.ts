import {
  demoJovem,
  demoLider,
  seedCampaigns,
  seedEvents,
  seedStudies,
  seedSuggestions,
} from "./demo-data";
import { getSupabase, isConfigured } from "./supabase";
import type {
  Campaign,
  EventItem,
  Profile,
  Role,
  StudyTheme,
  Suggestion,
} from "./types";

const DEMO_KEY = "manancial-demo-db-v2";

type DemoDb = {
  events: EventItem[];
  suggestions: Suggestion[];
  campaigns: Campaign[];
  studies: StudyTheme[];
  rsvps: string[];
};

function emptyDb(): DemoDb {
  return {
    events: [...seedEvents],
    suggestions: [...seedSuggestions],
    campaigns: [...seedCampaigns],
    studies: [...seedStudies],
    rsvps: [],
  };
}

function readDemo(): DemoDb {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return emptyDb();
    return { ...emptyDb(), ...JSON.parse(raw) } as DemoDb;
  } catch {
    return emptyDb();
  }
}

function writeDemo(db: DemoDb) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(db));
}

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export async function fetchEvents(): Promise<EventItem[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return readDemo().events.sort(
      (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
    );
  }
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventItem[];
}

export async function createEvent(
  input: Omit<EventItem, "id">,
): Promise<EventItem> {
  const supabase = getSupabase();
  if (!supabase) {
    const item = { ...input, id: id("ev") };
    const db = readDemo();
    db.events.push(item);
    writeDemo(db);
    return item;
  }
  const { data, error } = await supabase.from("events").insert(input).select().single();
  if (error) throw error;
  return data as EventItem;
}

export async function fetchSuggestions(): Promise<Suggestion[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return readDemo().suggestions.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Suggestion[];
}

export async function createSuggestion(input: {
  title: string;
  body: string;
  author_name: string;
  author_id: string;
}): Promise<Suggestion> {
  const supabase = getSupabase();
  if (!supabase) {
    const item: Suggestion = {
      id: id("sg"),
      title: input.title,
      body: input.body,
      author_name: input.author_name,
      created_at: new Date().toISOString(),
    };
    const db = readDemo();
    db.suggestions.unshift(item);
    writeDemo(db);
    return item;
  }
  const { data, error } = await supabase
    .from("suggestions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Suggestion;
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const supabase = getSupabase();
  if (!supabase) return readDemo().campaigns;
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("ends_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Campaign[];
}

export async function createCampaign(
  input: Omit<Campaign, "id">,
): Promise<Campaign> {
  const supabase = getSupabase();
  if (!supabase) {
    const item = { ...input, id: id("cp") };
    const db = readDemo();
    db.campaigns.unshift(item);
    writeDemo(db);
    return item;
  }
  const { data, error } = await supabase
    .from("campaigns")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function fetchStudies(): Promise<StudyTheme[]> {
  const supabase = getSupabase();
  if (!supabase) {
    return readDemo().studies.sort(
      (a, b) =>
        new Date(a.study_date).getTime() - new Date(b.study_date).getTime(),
    );
  }
  const { data, error } = await supabase
    .from("study_themes")
    .select("*")
    .order("study_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as StudyTheme[];
}

export async function createStudy(
  input: Omit<StudyTheme, "id">,
): Promise<StudyTheme> {
  const supabase = getSupabase();
  if (!supabase) {
    const item = { ...input, id: id("st") };
    const db = readDemo();
    db.studies.push(item);
    writeDemo(db);
    return item;
  }
  const { data, error } = await supabase
    .from("study_themes")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as StudyTheme;
}

export async function hasRsvp(eventId: string, userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    return readDemo().rsvps.includes(`${userId}:${eventId}`);
  }
  const { data, error } = await supabase
    .from("event_rsvps")
    .select("event_id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function toggleRsvp(
  eventId: string,
  userId: string,
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) {
    const db = readDemo();
    const key = `${userId}:${eventId}`;
    const has = db.rsvps.includes(key);
    db.rsvps = has ? db.rsvps.filter((item) => item !== key) : [...db.rsvps, key];
    writeDemo(db);
    return !has;
  }
  const already = await hasRsvp(eventId, userId);
  if (already) {
    const { error } = await supabase
      .from("event_rsvps")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from("event_rsvps").insert({
    event_id: eventId,
    user_id: userId,
  });
  if (error) throw error;
  return true;
}

export function demoProfile(role: Role): Profile {
  return role === "lider" ? demoLider : demoJovem;
}

export { isConfigured };
