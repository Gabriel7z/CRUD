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
import { isGmail, nameFromGmail, normalizeGmail } from "./gmail";
import { getSupabase } from "./supabase";
import type { Profile, Role } from "./types";

const DEMO_SESSION = "manancial-demo-session";

type AuthValue = {
  user: Profile | null;
  loading: boolean;
  demo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<{ needsEmailConfirmation: boolean }>;
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

function gmailOrThrow(email: string): string {
  const value = normalizeGmail(email);
  if (!isGmail(value)) {
    throw new Error("Use um endereço @gmail.com para entrar.");
  }
  return value;
}

function passwordOrThrow(password: string): string {
  if (password.length < 6) {
    throw new Error("A senha precisa ter pelo menos 6 caracteres.");
  }
  return password;
}

function translateAuthError(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "Gmail ou senha incorretos. Se ainda não tem conta, crie uma.";
  }
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "Esse Gmail já tem conta. Use a aba Entrar.";
  }
  if (text.includes("email not confirmed")) {
    return "Confirme sua conta pelo link que chegou no seu Gmail antes de entrar.";
  }
  if (text.includes("password should be at least")) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  if (text.includes("rate limit") || text.includes("too many requests")) {
    return "Muitas tentativas seguidas. Espere um pouco e tente de novo.";
  }
  return message;
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
        full_name: name || (email ? nameFromGmail(email) : "Jovem Manancial"),
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
      signIn: async (email, password) => {
        const gmail = gmailOrThrow(email);
        const supabase = getSupabase();
        if (!supabase) {
          const profile: Profile = {
            id: `demo-${gmail}`,
            email: gmail,
            full_name: nameFromGmail(gmail),
            avatar_url: null,
            role: "jovem",
          };
          localStorage.setItem(DEMO_SESSION, JSON.stringify(profile));
          setUser(profile);
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: gmail,
          password,
        });
        if (error) throw new Error(translateAuthError(error.message));
      },
      signUp: async (email, password, confirmPassword) => {
        const gmail = gmailOrThrow(email);
        passwordOrThrow(password);
        if (password !== confirmPassword) {
          throw new Error("As senhas não são iguais. Digite a mesma senha nos dois campos.");
        }
        const supabase = getSupabase();
        if (!supabase) {
          const profile: Profile = {
            id: `demo-${gmail}`,
            email: gmail,
            full_name: nameFromGmail(gmail),
            avatar_url: null,
            role: "jovem",
          };
          localStorage.setItem(DEMO_SESSION, JSON.stringify(profile));
          setUser(profile);
          return { needsEmailConfirmation: false };
        }
        const { data, error } = await supabase.auth.signUp({
          email: gmail,
          password,
          options: {
            emailRedirectTo: window.location.href,
            data: { full_name: nameFromGmail(gmail) },
          },
        });
        if (error) throw new Error(translateAuthError(error.message));
        return { needsEmailConfirmation: !data.session };
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
