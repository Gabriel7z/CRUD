import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Projeto "adesa" do Grupo Manancial. A publishable key é pública por
// natureza (o acesso aos dados é controlado pelas regras RLS no banco).
const DEFAULT_URL = "https://httiovvlsidzreeabdzq.supabase.co";
const DEFAULT_KEY = "sb_publishable_u19x_ju6QmeH9A9utFacig_T9frQ2CH";

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY;

let client: SupabaseClient | null = null;

export function isConfigured(): boolean {
  return Boolean(url && key);
}

export function getSupabase(): SupabaseClient | null {
  if (!isConfigured()) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}
