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
    id: "ev-1",
    title: "Culto de jovens",
    description:
      "Noite de louvor, palavra e comunhão. Chegue um pouco antes para ajudar na recepção.",
    starts_at: daysFromNow(2, 19, 0),
    location: "Templo ADESA 829",
    kind: "culto",
  },
  {
    id: "ev-2",
    title: "Ensaio da banda",
    description: "Ensaio aberto para quem serve no louvor e no som.",
    starts_at: daysFromNow(4, 18, 30),
    location: "Sala de ensaio",
    kind: "ensaio",
  },
  {
    id: "ev-3",
    title: "Saída evangelística",
    description: "Vamos às ruas do bairro com convite, oração e um versículo.",
    starts_at: daysFromNow(9, 16, 0),
    location: "Praça central",
    kind: "saida",
  },
  {
    id: "ev-4",
    title: "Retiro Manancial",
    description: "Fim de semana de imersão, amizade e encontro com Jesus.",
    starts_at: daysFromNow(21, 8, 0),
    location: "Sítio Esperança",
    kind: "retiro",
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
