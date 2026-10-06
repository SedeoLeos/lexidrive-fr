import {
  skills,
  type Progress,
  type Question,
  type Skill,
  type Attempt,
} from "./models";
export function initialProgress(): Progress {
  return {
    version: 1,
    name: "",
    goal: 10,
    onboarded: false,
    diagnosticAt: null,
    attempts: [],
    reviews: [],
    sessions: [],
    writings: [],
    learned: [],
    dictations: [],
    reminderHour: null,
  };
}
export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function profile(progress: Progress, bank: Question[]) {
  return (Object.keys(skills) as Skill[]).map((skill) => {
    const ids = new Set(bank.filter((q) => q.skill === skill).map((q) => q.id));
    // One recent answer per question avoids a repeated easy item inflating a skill score.
    const latest = new Map<string, Attempt>();
    progress.attempts
      .filter((a) => ids.has(a.questionId))
      .forEach((a) => latest.set(a.questionId, a));
    const values = [...latest.values()];
    const correct = values.filter((a) => a.correct).length;
    return {
      skill,
      seen: values.length,
      correct,
      score: values.length ? Math.round((correct / values.length) * 100) : null,
    };
  });
}
export { placementReport, stage, diagnostic } from "./assessment";
export function training(
  progress: Progress,
  bank: Question[],
  skill?: Skill,
  reviewOnly = false,
  limit = 10,
): Question[] {
  const now = Date.now();
  const last = new Map(progress.attempts.map((a) => [a.questionId, a]));
  const due = new Set(
    progress.reviews
      .filter((r) => new Date(r.due).getTime() <= now)
      .map((r) => r.questionId),
  );
  const weak = profile(progress, bank).sort(
    (a, b) => (a.score ?? -1) - (b.score ?? -1),
  );
  const rank = new Map(weak.map((p, i) => [p.skill, i]));
  return bank
    .filter(
      (q) => (!skill || q.skill === skill) && (!reviewOnly || due.has(q.id)),
    )
    .sort((a, b) => {
      const priority = (q: Question) =>
        due.has(q.id)
          ? 0
          : !last.has(q.id)
            ? 1
            : !last.get(q.id)?.correct
              ? 2
              : 3;
      return (
        priority(a) - priority(b) ||
        (skill ? 0 : (rank.get(a.skill) ?? 0) - (rank.get(b.skill) ?? 0)) ||
        new Date(last.get(a.id)?.at ?? 0).getTime() -
          new Date(last.get(b.id)?.at ?? 0).getTime() ||
        a.level - b.level
      );
    })
    .slice(0, limit);
}
export function recordSession(
  progress: Progress,
  answers: { question: Question; correct: boolean }[],
  mode: string,
  now = new Date(),
): Progress {
  const at = now.toISOString();
  const reviews = [...progress.reviews];
  for (const a of answers) {
    const idx = reviews.findIndex((r) => r.questionId === a.question.id);
    const previous = idx >= 0 ? reviews[idx] : undefined;
    const interval = a.correct
      ? Math.min((previous?.interval || 0.5) * 2, 30)
      : 0;
    const due = new Date(
      now.getTime() + (interval ? interval * 86400000 : 10 * 60000),
    ).toISOString();
    const entry = { questionId: a.question.id, due, interval };
    if (idx >= 0) reviews[idx] = entry;
    else reviews.push(entry);
  }
  return {
    ...progress,
    diagnosticAt:
      mode === "placement-v2" || mode === "diagnostic"
        ? at
        : progress.diagnosticAt,
    attempts: [
      ...progress.attempts,
      ...answers.map((a) => ({
        questionId: a.question.id,
        correct: a.correct,
        at,
      })),
    ].slice(-5000),
    reviews,
    sessions: [
      ...progress.sessions,
      {
        id: `${now.getTime()}-${progress.sessions.length}`,
        mode,
        correct: answers.filter((a) => a.correct).length,
        total: answers.length,
        ...(mode === "placement-v2" || mode.startsWith("mock:")
          ? {
              responses: answers.map((a) => ({
                questionId: a.question.id,
                correct: a.correct,
              })),
              exposedCount: answers.filter((a) =>
                progress.attempts.some(
                  (previous) => previous.questionId === a.question.id,
                ),
              ).length,
            }
          : {}),
        at,
      },
    ].slice(-1000),
  };
}
export function todayCount(progress: Progress) {
  const today = localDay();
  return progress.attempts.filter((a) => localDay(new Date(a.at)) === today)
    .length;
}
export function streak(progress: Progress) {
  const days = new Set(progress.sessions.map((s) => localDay(new Date(s.at))));
  let d = new Date();
  if (!days.has(localDay(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(localDay(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}
export function words(text: string): string[] {
  return (
    text
      .normalize("NFC")
      .toLocaleLowerCase("fr")
      .replace(/[’']/g, " ")
      .match(/[\p{L}\p{N}]+/gu) ?? []
  );
}
export function compareDictation(expected: string, actual: string) {
  const a = words(expected),
    b = words(actual);
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array<number>(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) dp[i]![0] = i;
  for (let j = 0; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  const distance = dp[a.length]![b.length]!;
  const differences: { expected: string; actual: string }[] = [];
  let i = a.length,
    j = b.length;
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      dp[i]![j] === dp[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1)
    ) {
      if (a[i - 1] !== b[j - 1])
        differences.unshift({ expected: a[i - 1]!, actual: b[j - 1]! });
      i--;
      j--;
    } else if (i > 0 && dp[i]![j] === dp[i - 1]![j]! + 1) {
      differences.unshift({ expected: a[i - 1]!, actual: "∅" });
      i--;
    } else {
      differences.unshift({ expected: "∅", actual: b[j - 1]! });
      j--;
    }
  }
  return {
    score: Math.max(
      0,
      Math.round((1 - distance / Math.max(a.length, 1)) * 100),
    ),
    differences,
  };
}
export function parseBackup(raw: string): Progress {
  const p = JSON.parse(raw);
  const validDate = (v: unknown) =>
    typeof v === "string" && Number.isFinite(Date.parse(v));
  const validId = (v: unknown) =>
    typeof v === "string" && v.length > 0 && v.length <= 100;
  if (
    !p ||
    p.version !== 1 ||
    typeof p.name !== "string" ||
    p.name.length > 80 ||
    ![5, 10, 15, 20].includes(p.goal) ||
    typeof p.onboarded !== "boolean" ||
    !(p.diagnosticAt === null || validDate(p.diagnosticAt)) ||
    !(
      p.reminderHour === null ||
      (Number.isInteger(p.reminderHour) &&
        p.reminderHour >= 0 &&
        p.reminderHour <= 23)
    )
  )
    throw Error("Format de sauvegarde non reconnu.");
  for (const key of [
    "attempts",
    "reviews",
    "sessions",
    "writings",
    "learned",
    "dictations",
  ])
    if (!Array.isArray(p[key]) || p[key].length > 10000)
      throw Error("Sauvegarde trop volumineuse ou incomplète.");
  if (
    !p.attempts.every(
      (x: any) =>
        validId(x.questionId) &&
        typeof x.correct === "boolean" &&
        validDate(x.at),
    ) ||
    !p.reviews.every(
      (x: any) =>
        validId(x.questionId) &&
        validDate(x.due) &&
        Number.isFinite(x.interval) &&
        x.interval >= 0 &&
        x.interval <= 30,
    ) ||
    !p.sessions.every(
      (x: any) =>
        validId(x.id) &&
        typeof x.mode === "string" &&
        Number.isInteger(x.total) &&
        x.total > 0 &&
        Number.isInteger(x.correct) &&
        x.correct >= 0 &&
        x.correct <= x.total &&
        validDate(x.at) &&
        (x.responses === undefined ||
          (Array.isArray(x.responses) &&
            x.responses.length === x.total &&
            new Set(x.responses.map((r: any) => r.questionId)).size ===
              x.total &&
            x.responses.every(
              (r: any) =>
                validId(r.questionId) && typeof r.correct === "boolean",
            ) &&
            x.responses.filter((r: any) => r.correct).length === x.correct)) &&
        (x.exposedCount === undefined ||
          (Number.isInteger(x.exposedCount) &&
            x.exposedCount >= 0 &&
            x.exposedCount <= x.total)),
    ) ||
    !p.writings.every(
      (x: any) =>
        validId(x.id) &&
        validId(x.promptId) &&
        typeof x.text === "string" &&
        x.text.length <= 30000 &&
        Array.isArray(x.checked) &&
        x.checked.every((y: unknown) => typeof y === "string") &&
        validDate(x.updatedAt),
    ) ||
    !p.learned.every(validId) ||
    !p.dictations.every(
      (x: any) =>
        validId(x.id) &&
        Number.isFinite(x.score) &&
        x.score >= 0 &&
        x.score <= 100 &&
        validDate(x.at),
    )
  )
    throw Error("La sauvegarde contient des données invalides.");
  return p as Progress;
}
