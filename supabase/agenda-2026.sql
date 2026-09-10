-- Use este arquivo apenas se você já tinha rodado o schema.sql antigo.
-- Ele troca os tipos de evento e substitui a agenda pela de 2026.
-- Quem vai rodar o schema.sql pela primeira vez não precisa deste arquivo.

alter table public.events drop constraint if exists events_kind_check;
alter table public.events
  add constraint events_kind_check
  check (kind in ('encontro', 'culto', 'vigilia', 'futebol', 'festa', 'outro'));
alter table public.events alter column kind set default 'encontro';

delete from public.events;

insert into public.events (title, description, starts_at, location, kind) values
  ('Aniversário Pr. Carlos', 'Vamos celebrar a vida do nosso pastor.', '2026-09-14T19:30:00-03:00', 'ADESA 829', 'festa'),
  ('Encontro dos jovens', 'Louvor, palavra e comunhão da juventude.', '2026-09-24T19:30:00-03:00', 'ADESA 829', 'encontro'),
  ('Futebol', 'Tarde de jogo e amizade.', '2026-09-26T15:00:00-03:00', 'Quadra', 'futebol'),
  ('Encontro dos jovens', 'Louvor, palavra e comunhão da juventude.', '2026-10-08T19:30:00-03:00', 'ADESA 829', 'encontro'),
  ('Galinhada', 'Almoço da juventude. Confirme presença.', '2026-10-10T12:00:00-03:00', 'ADESA 829', 'festa'),
  ('Vigília', 'Noite de oração e busca.', '2026-10-16T21:00:00-03:00', 'Congregação 507', 'vigilia'),
  ('Encontro dos jovens', 'Louvor, palavra e comunhão da juventude.', '2026-10-22T19:30:00-03:00', 'ADESA 829', 'encontro'),
  ('Futebol', 'Tarde de jogo e amizade.', '2026-10-24T15:00:00-03:00', 'Quadra', 'futebol'),
  ('Culto', 'Culto da juventude na congregação 615.', '2026-10-31T19:00:00-03:00', 'Congregação 615', 'culto'),
  ('Encontro dos jovens', 'Louvor, palavra e comunhão da juventude.', '2026-11-05T19:30:00-03:00', 'ADESA 829', 'encontro'),
  ('Futebol', 'Tarde de jogo e amizade.', '2026-11-14T15:00:00-03:00', 'Quadra', 'futebol'),
  ('Encontro dos jovens', 'Louvor, palavra e comunhão da juventude.', '2026-11-19T19:30:00-03:00', 'ADESA 829', 'encontro'),
  ('Culto', 'Culto da juventude na ADESA 829.', '2026-11-21T19:30:00-03:00', 'ADESA 829', 'culto'),
  ('Encontro dos jovens', 'Louvor, palavra e comunhão da juventude.', '2026-12-03T19:30:00-03:00', 'ADESA 829', 'encontro'),
  ('Confraternização dos jovens', 'Encerramento do ano com comida boa e gratidão.', '2026-12-05T19:00:00-03:00', 'ADESA 829', 'festa'),
  ('Encontro — agenda do próximo ano', 'Avaliação do ano e montagem da agenda.', '2026-12-17T19:30:00-03:00', 'ADESA 829', 'encontro');
