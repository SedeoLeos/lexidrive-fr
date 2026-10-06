import {
  cefrLevels,
  skills,
  type Progress,
  type Question,
  type CefrLevel,
  type Skill,
} from "./models";
export function diagnostic(bank: Question[]): Question[] {
  return cefrLevels.flatMap((level) =>
    (Object.keys(skills) as Skill[]).flatMap((skill) => {
      const q = bank.find(
        (q) =>
          q.cefr === level &&
          q.skill === skill &&
          q.assessmentRole === "placement",
      );
      return q ? [q] : [];
    }),
  );
}
export function placementReport(progress: Progress, bank: Question[]) {
  const expected = diagnostic(bank);
  const expectedIds = new Set(expected.map((q) => q.id));
  const session = [...progress.sessions]
    .reverse()
    .find(
      (s) =>
        s.mode === "placement-v2" &&
        s.responses &&
        s.responses.length === 42 &&
        s.responses.every((a) => expectedIds.has(a.questionId)) &&
        new Set(s.responses.map((a) => a.questionId)).size === 42,
    );
  if (!session || expected.length !== 42) return null;
  const answers = new Map(
    session.responses!.map((a) => [a.questionId, a.correct]),
  );
  const bands = cefrLevels.map((level) => {
    const items = expected.filter((q) => q.cefr === level);
    const correct = items.filter((q) => answers.get(q.id)).length;
    const foundations = items.filter((q) =>
      ["grammaire", "orthographe", "conjugaison"].includes(q.skill),
    );
    const foundationCorrect = foundations.filter((q) =>
      answers.get(q.id),
    ).length;
    return {
      level,
      correct,
      total: items.length,
      score: Math.round((correct / items.length) * 100),
      passed: correct >= 6 && foundationCorrect >= 2,
    };
  });
  let reached: CefrLevel | null = null;
  for (const b of bands) {
    if (!b.passed) break;
    reached = b.level;
  }
  const next =
    cefrLevels[reached ? Math.min(cefrLevels.indexOf(reached) + 1, 5) : 0]!;
  const bySkill = (Object.keys(skills) as Skill[]).map((skill) => {
    const items = expected.filter((q) => q.skill === skill);
    return {
      skill,
      correct: items.filter((q) => answers.get(q.id)).length,
      total: items.length,
      missed: items
        .filter((q) => !answers.get(q.id))
        .map((q) => ({ id: q.id, level: q.cefr! })),
    };
  });
  return {
    level: reached,
    next,
    bands,
    bySkill,
    at: session.at,
    exposedCount: session.exposedCount ?? 0,
    correct: session.correct,
    total: session.total,
  };
}
export function stage(progress: Progress, bank: Question[]) {
  const report = placementReport(progress, bank);
  if (!report)
    return {
      name: progress.diagnosticAt ? "À préciser" : "À découvrir",
      letter: "—",
      description: progress.diagnosticAt
        ? "Ton ancien quiz ne suffit pas à situer ton niveau. Fais le diagnostic approfondi, sans perdre tes résultats précédents."
        : "Le diagnostic approfondi explore six niveaux de difficulté à l’écrit.",
    };
  return {
    name: report.level
      ? `${report.level} · repère écrit provisoire`
      : "Bases écrites à consolider",
    letter: report.level ?? "—",
    description: `${report.level ? "Ce repère concerne les questions écrites du diagnostic." : "Les premières difficultés nécessitent un travail ciblé."} La rédaction libre et l’expression orale ne sont pas notées automatiquement. ${report.exposedCount ? "Certaines questions ont déjà été vues : la mémorisation peut améliorer le score." : ""}`,
  };
}
