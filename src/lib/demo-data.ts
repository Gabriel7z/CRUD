import { daysFromNow } from "./dates";
import type {
  Campaign,
  EventItem,
  Profile,
  StudyTheme,
  Suggestion,
} from "./types";

export const demoJovem: Profile = {
  id: "demo-jovem",
  full_name: "Ana Clara",
  email: "ana.clara@gmail.com",
  avatar_url: null,
  role: "jovem",
};

export const demoLider: Profile = {
  id: "demo-lider",
  full_name: "Pr. Lucas",
  email: "lider.manancial@gmail.com",
  avatar_url: null,
  role: "lider",
};

export const seedEvents: EventItem[] = [
  {
    id: "ev-01",
    title: "Aniversário Pr. Carlos",
    description: "Vamos celebrar a vida do nosso pastor. Traga um abraço e um sorriso.",
    starts_at: "2026-09-14T19:30:00-03:00",
    location: "ADESA 829",
    kind: "festa",
  },
  {
    id: "ev-02",
    title: "Encontro dos jovens",
    description: "Louvor, palavra e comunhão da juventude.",
    starts_at: "2026-09-24T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
  {
    id: "ev-03",
    title: "Futebol",
    description: "Tarde de jogo e amizade. Leve água e chegue no horário.",
    starts_at: "2026-09-26T15:00:00-03:00",
    location: "Quadra",
    kind: "futebol",
  },
  {
    id: "ev-04",
    title: "Encontro dos jovens",
    description: "Louvor, palavra e comunhão da juventude.",
    starts_at: "2026-10-08T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
  {
    id: "ev-05",
    title: "Galinhada",
    description: "Almoço da juventude. Confirme presença para contarmos os pratos.",
    starts_at: "2026-10-10T12:00:00-03:00",
    location: "ADESA 829",
    kind: "festa",
  },
  {
    id: "ev-06",
    title: "Vigília",
    description: "Noite de oração e busca. Vamos juntos ao encontro do Senhor.",
    starts_at: "2026-10-16T21:00:00-03:00",
    location: "Congregação 507",
    kind: "vigilia",
  },
  {
    id: "ev-07",
    title: "Encontro dos jovens",
    description: "Louvor, palavra e comunhão da juventude.",
    starts_at: "2026-10-22T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
  {
    id: "ev-08",
    title: "Futebol",
    description: "Tarde de jogo e amizade. Leve água e chegue no horário.",
    starts_at: "2026-10-24T15:00:00-03:00",
    location: "Quadra",
    kind: "futebol",
  },
  {
    id: "ev-09",
    title: "Culto",
    description: "Culto da juventude na congregação 615.",
    starts_at: "2026-10-31T19:00:00-03:00",
    location: "Congregação 615",
    kind: "culto",
  },
  {
    id: "ev-10",
    title: "Encontro dos jovens",
    description: "Louvor, palavra e comunhão da juventude.",
    starts_at: "2026-11-05T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
  {
    id: "ev-11",
    title: "Futebol",
    description: "Tarde de jogo e amizade. Leve água e chegue no horário.",
    starts_at: "2026-11-14T15:00:00-03:00",
    location: "Quadra",
    kind: "futebol",
  },
  {
    id: "ev-12",
    title: "Encontro dos jovens",
    description: "Louvor, palavra e comunhão da juventude.",
    starts_at: "2026-11-19T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
  {
    id: "ev-13",
    title: "Culto",
    description: "Culto da juventude na ADESA 829.",
    starts_at: "2026-11-21T19:30:00-03:00",
    location: "ADESA 829",
    kind: "culto",
  },
  {
    id: "ev-14",
    title: "Encontro dos jovens",
    description: "Louvor, palavra e comunhão da juventude.",
    starts_at: "2026-12-03T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
  {
    id: "ev-15",
    title: "Confraternização dos jovens",
    description: "Encerramento do ano com comida boa, testemunhos e gratidão.",
    starts_at: "2026-12-05T19:00:00-03:00",
    location: "ADESA 829",
    kind: "festa",
  },
  {
    id: "ev-16",
    title: "Encontro — agenda do próximo ano",
    description: "Último encontro do ano: avaliação e montagem da agenda.",
    starts_at: "2026-12-17T19:30:00-03:00",
    location: "ADESA 829",
    kind: "encontro",
  },
];

export const seedCampaigns: Campaign[] = [
  {
    id: "cp-1",
    title: "21 dias de oração",
    description:
      "Um acordo da juventude: orar todos os dias pelo despertar da nossa geração.",
    goal: 21,
    current: 9,
    unit: "oracao",
    ends_at: daysFromNow(12, 23, 59),
  },
  {
    id: "cp-2",
    title: "Oferta do retiro",
    description: "Juntos cobrimos alimentação, transporte e material do retiro.",
    goal: 3500,
    current: 1420,
    unit: "reais",
    ends_at: daysFromNow(18, 23, 59),
  },
  {
    id: "cp-3",
    title: "Bíblias para novos",
    description: "Queremos entregar uma Bíblia a cada jovem que chegar neste trimestre.",
    goal: 40,
    current: 17,
    unit: "pessoas",
    ends_at: daysFromNow(30, 23, 59),
  },
];

export const seedStudies: StudyTheme[] = [
  {
    id: "st-1",
    title: "Águas vivas",
    verse:
      "Quem crê em mim, como diz a Escritura, rios de água viva correrão do seu interior.",
    verse_ref: "João 7:38",
    description:
      "O manancial não é um lugar distante: é Cristo em nós, transbordando para a cidade.",
    study_date: daysFromNow(2, 19, 40),
  },
  {
    id: "st-2",
    title: "Identidade em Cristo",
    verse: "Portanto, se alguém está em Cristo, é nova criatura.",
    verse_ref: "2 Coríntios 5:17",
    description:
      "Quem você é quando as redes sociais se calam? Vamos falar de nome, chamado e pertencimento.",
    study_date: daysFromNow(9, 19, 40),
  },
  {
    id: "st-3",
    title: "Amizade que edifica",
    verse:
      "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.",
    verse_ref: "Eclesiastes 4:9",
    description:
      "Como construir uma turma que ora, corrige com amor e não deixa ninguém para trás.",
    study_date: daysFromNow(16, 19, 40),
  },
];

export const seedSuggestions: Suggestion[] = [
  {
    id: "sg-1",
    title: "Noite acústica no templo",
    body: "Uma sexta só com violão, testemunhos e um café depois. Daria para convidar a galera da escola.",
    author_name: "Rafael",
    created_at: daysFromNow(-1, 21, 10),
  },
  {
    id: "sg-2",
    title: "Grupo de corrida",
    body: "Treinar juntos no sábado cedo e fechar com um versículo. Corpo e alma no mesmo ritmo.",
    author_name: "Bianca",
    created_at: daysFromNow(-3, 14, 0),
  },
];
