import test from "node:test";
import assert from "node:assert/strict";
import {
  questions,
  lessons,
  allQuestions,
  assessmentQuestions,
} from "../src/content";
import { skills } from "../src/domain/models";
import {
  initialProgress,
  diagnostic,
  recordSession,
  profile,
  training,
  parseBackup,
  compareDictation,
  stage,
  words,
} from "../src/domain/learning";
import { reminderCalendar } from "../src/infrastructure/calendar";
test("chaque question a un identifiant unique, des choix distincts et une leçon existante", () => {
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length);
  assert.ok(questions.length >= 125);
  for (const q of allQuestions) {
    assert.equal(new Set(q.choices).size, q.choices.length);
    assert.ok(q.answer >= 0 && q.answer < q.choices.length);
    assert.ok(lessons.some((l) => l.id === q.lessonId && l.skill === q.skill));
    assert.ok(q.explanation.length > 20);
    assert.ok(q.tip.length > 20);
  }
});
test("le diagnostic couvre sept compétences et six niveaux avec 42 questions", () => {
  const items = diagnostic(allQuestions);
  assert.equal(items.length, 42);
  for (const skill of Object.keys(skills))
    assert.equal(items.filter((q) => q.skill === skill).length, 6);
});
test("les résultats restent uniques par question et reflètent la dernière réponse", () => {
  const q = questions[0]!;
  let p = recordSession(
    initialProgress(),
    [{ question: q, correct: false }],
    "training",
  );
  p = recordSession(p, [{ question: q, correct: true }], "training");
  const skill = profile(p, questions).find((s) => s.skill === q.skill)!;
  assert.equal(skill.seen, 1);
  assert.equal(skill.score, 100);
  assert.equal(p.sessions.length, 2);
});
test("une erreur revient après dix minutes, une réussite espace la révision", () => {
  const q = questions[0]!;
  const now = new Date("2026-10-05T12:00:00Z");
  let p = recordSession(
    initialProgress(),
    [{ question: q, correct: false }],
    "daily",
    now,
  );
  assert.equal(p.reviews[0]!.due, "2026-10-05T12:10:00.000Z");
  p = recordSession(p, [{ question: q, correct: true }], "review", now);
  assert.equal(p.reviews.length, 1);
  assert.equal(p.reviews[0]!.interval, 1);
});
test("entraînement ciblé et révisions respectent les filtres", () => {
  const p = initialProgress();
  assert.equal(training(p, questions, undefined, true).length, 0);
  assert.ok(
    training(p, questions, "grammaire").every((q) => q.skill === "grammaire"),
  );
  p.reviews = [
    { questionId: questions[0]!.id, due: "2020-01-01T00:00:00Z", interval: 1 },
  ];
  assert.equal(
    training(p, questions, undefined, true)[0]!.id,
    questions[0]!.id,
  );
});
test("la dictée conserve les accents, distingue omissions et ajouts", () => {
  assert.equal(compareDictation("À bientôt !", "à bientôt.").score, 100);
  assert.ok(compareDictation("À bientôt !", "A bientôt").score < 100);
  assert.deepEqual(
    compareDictation("Le petit chat dort.", "Le chat dort.").differences,
    [{ expected: "petit", actual: "∅" }],
  );
  assert.deepEqual(
    compareDictation("Le chat dort.", "Le petit chat dort.").differences,
    [{ expected: "∅", actual: "petit" }],
  );
  assert.equal(compareDictation("Une phrase.", "").score, 0);
  assert.equal(compareDictation("Il s’est levé.", "Il s'est levé").score, 100);
  assert.deepEqual(words("écrire une idée"), ["écrire", "une", "idée"]);
});
test("sauvegarde : aller-retour et refus des données incohérentes", () => {
  const p = initialProgress();
  assert.deepEqual(parseBackup(JSON.stringify(p)), p);
  for (const mutation of [
    { version: 2 },
    { goal: -10 },
    { reviews: [{ questionId: "q001", due: "invalide", interval: 1 }] },
    { writings: [{}] },
    {
      attempts: [
        { questionId: "q001", correct: "oui", at: new Date().toISOString() },
      ],
    },
  ])
    assert.throws(() => parseBackup(JSON.stringify({ ...p, ...mutation })));
});
test("pas de palier avant diagnostic", () =>
  assert.equal(stage(initialProgress(), questions).name, "À découvrir"));
test("le rappel calendrier contient une alarme et une récurrence locale", () => {
  const ics = reminderCalendar(18, new Date("2026-10-05T00:00:00Z"));
  assert.ok(ics.includes("RRULE:FREQ=DAILY"));
  assert.ok(ics.includes("BEGIN:VALARM"));
  assert.ok(ics.includes("T180000"));
  assert.ok(ics.endsWith("\r\n"));
});

import { placementReport } from "../src/domain/assessment";
import { cefrLevels } from "../src/domain/models";
test("13 réussites sur 15 anciennes questions ne donnent pas un niveau avancé", () => {
  const items = questions.slice(0, 15);
  const p = recordSession(
    initialProgress(),
    items.map((question, i) => ({ question, correct: i < 13 })),
    "diagnostic",
  );
  assert.equal(stage(p, allQuestions).name, "À préciser");
  assert.equal(placementReport(p, allQuestions), null);
});
test("chaque examen blanc contient les six niveaux et une écoute originale", () => {
  for (const level of cefrLevels) {
    const items = assessmentQuestions.filter((q) => q.cefr === level);
    assert.equal(items.length, 13);
    assert.equal(items.filter((q) => q.audioKey).length, 3);
    assert.equal(
      items.filter((q) => q.assessmentRole === "placement").length,
      7,
    );
  }
});
test("les bases manquantes bloquent la montée, même avec 40 réponses sur 42", () => {
  const items = diagnostic(allQuestions);
  const p = recordSession(
    initialProgress(),
    items.map((question, i) => ({ question, correct: i >= 2 })),
    "placement-v2",
  );
  const report = placementReport(p, allQuestions)!;
  assert.equal(report.correct, 40);
  assert.equal(report.level, null);
  assert.equal(report.next, "A1");
});
test("la progression ne saute pas un niveau insuffisant", () => {
  const items = diagnostic(allQuestions);
  const p = recordSession(
    initialProgress(),
    items.map((question) => ({ question, correct: question.cefr !== "B1" })),
    "placement-v2",
  );
  assert.equal(placementReport(p, allQuestions)!.level, "A2");
});
test("un diagnostic partiel ne donne aucun niveau", () => {
  const p = recordSession(
    initialProgress(),
    diagnostic(allQuestions)
      .slice(0, 15)
      .map((question) => ({ question, correct: true })),
    "placement-v2",
  );
  assert.equal(placementReport(p, allQuestions), null);
});
test("les entraînements ne modifient pas le résultat indépendant du diagnostic", () => {
  const items = diagnostic(allQuestions);
  let p = recordSession(
    initialProgress(),
    items.map((question) => ({ question, correct: question.cefr !== "C2" })),
    "placement-v2",
  );
  p = recordSession(
    p,
    items.map((question) => ({ question, correct: true })),
    "training",
  );
  assert.equal(placementReport(p, allQuestions)!.level, "C1");
  const repeated = recordSession(
    p,
    items.map((question) => ({ question, correct: true })),
    "placement-v2",
  );
  assert.equal(placementReport(repeated, allQuestions)!.exposedCount, 42);
  assert.ok(stage(repeated, allQuestions).name.includes("provisoire"));
});
test("les nouveaux résultats sont sauvegardés sans casser les anciennes données", () => {
  const p = recordSession(
    initialProgress(),
    diagnostic(allQuestions).map((question) => ({ question, correct: true })),
    "placement-v2",
  );
  assert.deepEqual(parseBackup(JSON.stringify(p)), p);
  const bad = {
    ...p,
    sessions: [
      { ...p.sessions[0], responses: [{ questionId: "x", correct: true }] },
    ],
  };
  assert.throws(() => parseBackup(JSON.stringify(bad)));
});
test("les identifiants de conjugaison existants sont conservés", () =>
  assert.ok(
    questions.find((q) => q.id === "q126")!.prompt.includes("travailler"),
  ));
