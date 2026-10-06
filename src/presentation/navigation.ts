import type { Question, Skill, CefrLevel } from "../domain/models";
export type Tab = "home" | "practice" | "library" | "progress";
export type Route =
  | { kind: "tab"; tab: Tab }
  | { kind: "quiz"; questions: Question[]; mode: string; title: string }
  | { kind: "lesson"; id: string }
  | { kind: "writing"; id: string }
  | { kind: "reading"; id: string }
  | { kind: "dictation"; id: string }
  | { kind: "certifications" }
  | { kind: "certification"; level: CefrLevel }
  | { kind: "tips" }
  | { kind: "settings" };
export type Navigate = (route: Route) => void;
