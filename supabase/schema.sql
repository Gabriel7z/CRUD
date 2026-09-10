-- Grupo Manancial · Jovens ADESA 829
-- Cole este arquivo no SQL Editor do Supabase e execute.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  role text not null default 'jovem' check (role in ('jovem', 'lider')),
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  starts_at timestamptz not null,
  location text not null,
  kind text not null default 'culto' check (kind in ('culto', 'ensaio', 'saida', 'retiro', 'outro')),
  created_at timestamptz not null default now()
);

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author_name text not null,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  goal numeric not null,
  current numeric not null default 0,
  unit text not null check (unit in ('oracao', 'reais', 'pessoas')),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.study_themes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  verse text not null,
  verse_ref text not null,
  description text not null,
  study_date timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.suggestions enable row level security;
alter table public.campaigns enable row level security;
alter table public.study_themes enable row level security;
alter table public.event_rsvps enable row level security;

create or replace function public.is_leader()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'lider'
  );
$$;

drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles
  for select to authenticated using (true);

drop policy if exists "profiles self upsert" on public.profiles;
create policy "profiles self upsert" on public.profiles
  for insert to authenticated with check (id = auth.uid());

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update to authenticated using (id = auth.uid());

drop policy if exists "events readable" on public.events;
create policy "events readable" on public.events
  for select to authenticated using (true);

drop policy if exists "events leaders write" on public.events;
create policy "events leaders write" on public.events
  for insert to authenticated with check (public.is_leader());

drop policy if exists "suggestions readable" on public.suggestions;
create policy "suggestions readable" on public.suggestions
  for select to authenticated using (true);

drop policy if exists "suggestions insert" on public.suggestions;
create policy "suggestions insert" on public.suggestions
  for insert to authenticated with check (author_id = auth.uid());

drop policy if exists "campaigns readable" on public.campaigns;
create policy "campaigns readable" on public.campaigns
  for select to authenticated using (true);

drop policy if exists "campaigns leaders write" on public.campaigns;
create policy "campaigns leaders write" on public.campaigns
  for insert to authenticated with check (public.is_leader());

drop policy if exists "studies readable" on public.study_themes;
create policy "studies readable" on public.study_themes
  for select to authenticated using (true);

drop policy if exists "studies leaders write" on public.study_themes;
create policy "studies leaders write" on public.study_themes
  for insert to authenticated with check (public.is_leader());

drop policy if exists "rsvps readable" on public.event_rsvps;
create policy "rsvps readable" on public.event_rsvps
  for select to authenticated using (true);

drop policy if exists "rsvps write self" on public.event_rsvps;
create policy "rsvps write self" on public.event_rsvps
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "rsvps delete self" on public.event_rsvps;
create policy "rsvps delete self" on public.event_rsvps
  for delete to authenticated using (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(coalesce(new.email, 'jovem'), '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    'jovem'
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.events (title, description, starts_at, location, kind) values
  ('Culto de jovens', 'Noite de louvor, palavra e comunhão.', now() + interval '2 days', 'Templo ADESA 829', 'culto'),
  ('Ensaio da banda', 'Ensaio aberto para quem serve no louvor e no som.', now() + interval '4 days', 'Sala de ensaio', 'ensaio'),
  ('Saída evangelística', 'Convite, oração e um versículo nas ruas do bairro.', now() + interval '9 days', 'Praça central', 'saida'),
  ('Retiro Manancial', 'Fim de semana de imersão, amizade e encontro com Jesus.', now() + interval '21 days', 'Sítio Esperança', 'retiro');

insert into public.campaigns (title, description, goal, current, unit, ends_at) values
  ('21 dias de oração', 'Orar todos os dias pelo despertar da nossa geração.', 21, 9, 'oracao', now() + interval '12 days'),
  ('Oferta do retiro', 'Alimentação, transporte e material do retiro.', 3500, 1420, 'reais', now() + interval '18 days'),
  ('Bíblias para novos', 'Uma Bíblia para cada jovem que chegar neste trimestre.', 40, 17, 'pessoas', now() + interval '30 days');

insert into public.study_themes (title, verse, verse_ref, description, study_date) values
  ('Águas vivas', 'Quem crê em mim, como diz a Escritura, rios de água viva correrão do seu interior.', 'João 7:38', 'O manancial é Cristo em nós, transbordando para a cidade.', now() + interval '2 days'),
  ('Identidade em Cristo', 'Portanto, se alguém está em Cristo, é nova criatura.', '2 Coríntios 5:17', 'Nome, chamado e pertencimento quando as redes se calam.', now() + interval '9 days'),
  ('Amizade que edifica', 'Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.', 'Eclesiastes 4:9', 'Uma turma que ora, corrige com amor e não deixa ninguém para trás.', now() + interval '16 days');

-- Depois do primeiro login, transforme a liderança:
-- update public.profiles set role = 'lider' where email = 'seu-gmail@gmail.com';
