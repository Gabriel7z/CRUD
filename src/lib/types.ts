export type Role = "jovem" | "lider";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: Role;
};

export type EventKind = "culto" | "ensaio" | "saida" | "retiro" | "outro";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  location: string;
  kind: EventKind;
};

export type Suggestion = {
  id: string;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
};

export type CampaignUnit = "oracao" | "reais" | "pessoas";

export type Campaign = {
  id: string;
  title: string;
  description: string;
  goal: number;
  current: number;
  unit: CampaignUnit;
  ends_at: string;
};

export type StudyTheme = {
  id: string;
  title: string;
  verse: string;
  verse_ref: string;
  description: string;
  study_date: string;
};
