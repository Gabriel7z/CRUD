import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoProfile, isConfigured } from "./api";
import { getSupabase } from "./supabase";
import type { Profile, Role } from "./types";

const DEMO_SESSION = "manancial-demo-session";

type AuthValue = {
  user: Profile | null;
  loading: boolean;
  demo: boolean;
  signInWithGoogle: () => Promise<void>;
  enterDemo: (role: Role) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

function readDemoUser(): Profile | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const demo = !isConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setUser(readDemoUser());
      setLoading(false);
      return;
    }

    const mapUser = async (id: string, email?: string, name?: string, avatar?: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        setUser(data as Profile);
        return;
      }
      const profile: Profile = {
        id,
        email: email ?? "",
        full_name: name || email?.split("@")[0] || "Jovem Manancial",
        avatar_url: avatar ?? null,
        role: "jovem",
      };
      await supabase.from("profiles").upsert(profile);
      setUser(profile);
    };

    supabase.auth.getSession().then(({ data }) => {
      const session = data.session;
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      const meta = session.user.user_metadata ?? {};
      mapUser(
        session.user.id,
        session.user.email,
        meta.full_name || meta.name,
        meta.avatar_url,
      ).finally(() => setLoading(false));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }
      const meta = session.user.user_metadata ?? {};
      void mapUser(
        session.user.id,
        session.user.email,
        meta.full_name || meta.name,
        meta.avatar_url,
      );
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      demo,
      signInWithGoogle: async () => {
        const supabase = getSupabase();
        if (!supabase) {
          throw new Error("Supabase ainda não está configurado.");
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
            queryParams: { prompt: "select_account" },
          },
        });
        if (error) throw error;
      },
      enterDemo: (role) => {
        const profile = demoProfile(role);
        localStorage.setItem(DEMO_SESSION, JSON.stringify(profile));
        setUser(profile);
      },
      signOut: async () => {
        localStorage.removeItem(DEMO_SESSION);
        const supabase = getSupabase();
        if (supabase) await supabase.auth.signOut();
        setUser(null);
      },
    }),
    [demo, loading, user],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
