import { View, Pressable, useWindowDimensions } from "react-native";
import { useProgress } from "../../application/ProgressProvider";
import { questions, lessons, allQuestions } from "../../content";
import {
  profile,
  stage,
  streak,
  training,
  placementReport,
  diagnostic,
} from "../../domain/learning";
import { skills } from "../../domain/models";
import {
  Badge,
  Bar,
  Button,
  Card,
  Empty,
  Heading,
  Icon,
  Label,
  T,
} from "../atoms/ui";
import { Section } from "../molecules/Section";
import type { Navigate } from "../navigation";
export function ProgressScreen({ navigate }: { navigate: Navigate }) {
  const { progress } = useProgress();
  const wide = useWindowDimensions().width > 700;
  const level = stage(progress, allQuestions);
  const report = placementReport(progress, allQuestions);
  const latest = new Map(progress.attempts.map((a) => [a.questionId, a]));
  const mistakes = [...latest.values()]
    .filter((a) => !a.correct)
    .reverse()
    .slice(0, 8);
  const due = training(progress, questions, undefined, true, 125);
  return (
    <View className="gap-6">
      <Label>Les petits progrès deviennent des acquis</Label>
      <Heading>Ton chemin, en français.</Heading>
      <T muted>
        Un profil qui évolue avec tes réponses. Pas de comparaison avec les
        autres.
      </T>
      <View className={`gap-4 ${wide ? "flex-row" : ""}`}>
        <Card className="flex-1">
          <Badge>REPÈRE ÉCRIT {level.letter}</Badge>
          <Heading>{level.name}</Heading>
          <T muted className="mt-3">
            {level.description}
          </T>
          <T muted className="mt-3 text-xs">
            Échelle de travail A1–C2, estimation non certifiée. Le score d’un
            quiz ne suffit pas à mesurer toute ta maîtrise du français.
          </T>
        </Card>
        <Card className="flex-1">
          <View className="flex-row gap-8">
            <Stat n={progress.sessions.length} title="séances" />
            <Stat n={streak(progress)} title="jours de suite" />
          </View>
          <View className="flex-row gap-8 mt-5">
            <Stat
              n={
                progress.learned.filter((id) =>
                  lessons.some((l) => l.id === id),
                ).length
              }
              title="leçons lues"
            />
            <Stat n={progress.writings.length} title="brouillons" />
          </View>
        </Card>
      </View>
      <Button
        icon="GraduationCap"
        onPress={() =>
          navigate({
            kind: "quiz",
            questions: diagnostic(allQuestions),
            mode: "placement-v2",
            title: "Diagnostic approfondi A1–C2",
          })
        }
      >
        {report
          ? "Refaire le diagnostic approfondi"
          : "Situer mon niveau · 42 questions"}
      </Button>
      {report && (
        <View className="gap-4">
          <Section title="Ce que le diagnostic a réellement mesuré" />
          <Card>
            <T>
              Le repère exige au moins 6 réponses sur 7 à chaque palier
              successif, avec au moins 2 réponses sur 3 dans les bases de
              grammaire, conjugaison et orthographe. Ce seuil pédagogique n’est
              pas un barème officiel.
            </T>
            <T muted className="mt-3">
              Reconnaissance des formes et compréhension écrite : évaluées par
              questions. Rédaction libre, écoute et expression orale : non
              mesurées par ce diagnostic.
            </T>
            {report.exposedCount > 0 && (
              <T className="text-brand mt-3">
                {report.exposedCount} questions déjà vues. Un nouveau passage
                peut mesurer aussi la mémorisation.
              </T>
            )}
          </Card>
          {report.bands.map((b) => (
            <Card key={b.level}>
              <View className="flex-row justify-between">
                <Badge>{b.level}</Badge>
                <T>
                  {b.correct} / {b.total} ·{" "}
                  {b.passed ? "Seuil des questions atteint" : "À travailler"}
                </T>
              </View>
              <View className="mt-3">
                <Bar value={b.score} />
              </View>
            </Card>
          ))}
          <Card>
            <Label>Points à retravailler</Label>
            {report.bySkill
              .filter((p) => p.missed.length > 0)
              .map((p) => (
                <View key={p.skill} className="mt-3">
                  <T style={{ fontFamily: "InterSemi" }}>
                    {skills[p.skill].title}
                  </T>
                  <T muted>
                    {p.missed.map((q) => q.level).join(", ")} · {p.correct} /{" "}
                    {p.total} réponses
                  </T>
                </View>
              ))}
            <T muted className="mt-3">
              Ton aisance à l’oral peut être différente de tes résultats à
              l’écrit. Les ateliers de rédaction t’aident à vérifier le passage
              des règles aux phrases libres.
            </T>
          </Card>
        </View>
      )}
      <View>
        <Section title="Tes compétences" />
        <Card>
          {profile(progress, allQuestions).map((p) => (
            <View key={p.skill} className="mb-5">
              <View className="flex-row justify-between mb-2">
                <T style={{ fontFamily: "InterSemi" }}>
                  {skills[p.skill].title}
                </T>
                <T muted>{p.score === null ? "À explorer" : `${p.score} %`}</T>
              </View>
              <Bar value={p.score ?? 0} />
              <T muted className="text-xs mt-1">
                {p.seen
                  ? `${p.seen} questions distinctes · dernière réponse prise en compte`
                  : "Pas encore de réponse enregistrée"}
              </T>
            </View>
          ))}
        </Card>
      </View>
      <View>
        <Section title="Ton carnet d’erreurs" />
        {mistakes.length ? (
          <View className="gap-3">
            {mistakes.map((a) => {
              const q = allQuestions.find((q) => q.id === a.questionId);
              if (!q) return null;
              return (
                <Pressable
                  key={a.questionId}
                  accessibilityRole="button"
                  onPress={() => navigate({ kind: "lesson", id: q.lessonId })}
                  className="bg-white border border-line rounded-2xl p-4"
                >
                  <Label>{skills[q.skill].title}</Label>
                  <T className="mt-1">{q.prompt}</T>
                  <T className="text-sage mt-2">
                    Réponse : {q.choices[q.answer]}
                  </T>
                  <T muted className="mt-1">
                    {q.explanation}
                  </T>
                  <T className="text-brand text-xs mt-2">Relire la leçon →</T>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Empty
            title="Un carnet prêt à t’aider"
            body="Tes erreurs récentes apparaîtront ici, avec leur explication et la leçon correspondante."
          />
        )}
      </View>
      <Button
        disabled={!due.length}
        onPress={() =>
          navigate({
            kind: "quiz",
            questions: due.slice(0, 10),
            mode: "review",
            title: "Mes révisions",
          })
        }
        icon="RotateCcw"
      >
        {due.length
          ? `Réviser · ${due.length} questions disponibles`
          : "Pas de révision arrivée à échéance"}
      </Button>
      <Button
        secondary
        icon="GraduationCap"
        onPress={() => navigate({ kind: "certifications" })}
      >
        Préparer un niveau et un examen blanc
      </Button>
      <View>
        <Section title="Tes dernières séances" />
        {progress.sessions.length ? (
          <Card>
            {progress.sessions
              .slice(-5)
              .reverse()
              .map((s) => (
                <View
                  key={s.id}
                  className="flex-row justify-between items-center py-3 border-b border-line"
                >
                  <View>
                    <T>
                      {s.mode === "diagnostic" || s.mode === "placement-v2"
                        ? "Diagnostic"
                        : s.mode.startsWith("mock:")
                          ? `Examen blanc ${s.mode.slice(5)}`
                          : s.mode === "exam"
                            ? "Évaluation"
                            : s.mode === "review"
                              ? "Révisions"
                              : "Entraînement"}
                    </T>
                    <T muted className="text-xs">
                      {new Date(s.at).toLocaleDateString("fr-FR")}
                    </T>
                  </View>
                  <Badge green>
                    {s.correct} / {s.total}
                  </Badge>
                </View>
              ))}
          </Card>
        ) : (
          <T muted>Ta première séance t’attend.</T>
        )}
      </View>
    </View>
  );
}
function Stat({ n, title }: { n: number; title: string }) {
  return (
    <View className="flex-1">
      <T
        className="text-3xl leading-10 text-brand"
        style={{ fontFamily: "InterSemi" }}
      >
        {n}
      </T>
      <T muted className="text-xs">
        {title}
      </T>
    </View>
  );
}
