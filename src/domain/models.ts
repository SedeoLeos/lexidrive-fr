export const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
export type CefrLevel = (typeof cefrLevels)[number];
export type Skill =
  | "homophones"
  | "grammaire"
  | "conjugaison"
  | "orthographe"
  | "vocabulaire"
  | "redaction"
  | "comprehension";
export type Question = {
  id: string;
  skill: Skill;
  level: 1 | 2 | 3;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  tip: string;
  lessonId: string;
  cefr?: CefrLevel;
  assessmentRole?: "placement" | "extension";
  context?: string;
  audioKey?: string;
};
export type Lesson = {
  id: string;
  skill: Skill;
  title: string;
  subtitle: string;
  rule: string;
  examples: string[];
  tip: string;
};
export type Attempt = { questionId: string; correct: boolean; at: string };
export type Review = { questionId: string; due: string; interval: number };
export type Writing = {
  id: string;
  promptId: string;
  text: string;
  checked: string[];
  updatedAt: string;
};
export type Session = {
  id: string;
  mode: string;
  correct: number;
  total: number;
  responses?: { questionId: string; correct: boolean }[];
  exposedCount?: number;
  at: string;
};
export type Progress = {
  version: 1;
  name: string;
  goal: number;
  onboarded: boolean;
  diagnosticAt: string | null;
  attempts: Attempt[];
  reviews: Review[];
  sessions: Session[];
  writings: Writing[];
  learned: string[];
  dictations: { id: string; score: number; at: string }[];
  reminderHour: number | null;
};
export interface ProgressRepository {
  load(): Promise<Progress>;
  save(progress: Progress): Promise<void>;
}
export const skills: Record<
  Skill,
  { title: string; description: string; symbol: string }
> = {
  homophones: {
    title: "Homophones",
    description: "On, ont, ces, ses… Trouver le mot juste.",
    symbol: "Aa",
  },
  grammaire: {
    title: "Grammaire",
    description: "Accords, déterminants et phrases solides.",
    symbol: "&",
  },
  conjugaison: {
    title: "Conjugaison",
    description: "Choisir le bon temps, former le bon verbe.",
    symbol: "↗",
  },
  orthographe: {
    title: "Orthographe",
    description: "Accents, mots difficiles et ponctuation.",
    symbol: "é",
  },
  vocabulaire: {
    title: "Vocabulaire",
    description: "Des mots précis, un registre plus soutenu.",
    symbol: "✧",
  },
  redaction: {
    title: "Rédaction",
    description: "Exprimer ses idées avec clarté et élégance.",
    symbol: "¶",
  },
  comprehension: {
    title: "Compréhension",
    description: "Lire avec attention et saisir les nuances.",
    symbol: "≋",
  },
};
